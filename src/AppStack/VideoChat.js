import React from 'react';
import {Text, Container, Header, Left, Right, Body, Icon, Button} from 'native-base';
import {TouchableOpacity, StyleSheet} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices} from 'react-native-webrtc';

export default class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answersFrom: {},
      localVideo: false,
      remoteVideo: false,
      localStream: '',
      remoteStream: '',
      targetSocketId: '',
    };
  }

  startLocalStream = async () => {
    try {
      const isFront = true;
      const devices = await mediaDevices.enumerateDevices();
      const facing = isFront ? 'front' : 'back';
      const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
      const facingMode = isFront ? 'user' : 'environment';
      const constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500,
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode,
          optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      };
      const newStream = await mediaDevices.getUserMedia(constraints);
      await this.pc.addStream(newStream);
      this.setState({localStream: newStream, localVideo: true});
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.socket = this.props.navigation.getParam('socketRef');
    const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
    this.pc = new RTCPeerConnection(configuration);

    this.socket.on('offer-made', async data => {
      try {
        let offer = data.offer;
        await this.pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        let answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(new RTCSessionDescription(answer));
        this.socket.emit('make-answer', {
          answer: answer,
          to: data.socket,
        });
      } catch (error) {
        console.log(error);
      }
    });

    this.socket.on(
      'answer-made',
      async function(data) {
        try {
          await this.pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          if (!this.state.answersFrom[data.socket]) {
            this.createOffer(data.socket);
            this.state.answersFrom[data.socket] = true;
            console.log(data.answer);
          }
        } catch (error) {
          console.log(error);
        }
      }.bind(this),
    );

    this.socket.on(
      'do-disconnect',
      function(data) {
        if (this.remoteVideo === true) {
          this.setState({remoteVideo: false, localVideo: false, remoteStream: '', localStream: ''});
          this.pc.close();
          this.setState({targetSocketId: ''});
        }
      }.bind(this),
    );

    this.pc.onaddstream = e => {
      InCallManager.start({media: 'video'});
      InCallManager.setSpeakerphoneOn(true);
      //   this.setState({remoteStream: e.stream, remoteVideo: true});
    };

    this.startLocalStream();
    let is_create_offer = this.props.navigation.getParam('create_offer');
    if (is_create_offer) {
      let id = this.props.navigation.getParam('id');
      this.createOffer(id);
    }
  }

  createOffer = async id => {
    try {
      this.setState({targetSocketId: id});
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(new RTCSessionDescription(offer));
      this.socket.emit('make-offer', {
        offer: offer,
        to: id,
        calling_type: this.state.calling_type,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {localVideo, remoteVideo} = this.state;
    if (!localVideo && !remoteVideo) {
      return null;
    }
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: 'white'}} />
            </TouchableOpacity>
          </Left>
          <Body>
            {/* <Text style={{color: 'white', fontSize: 20, width: '120%', fontWeight: 'bold'}}>{username}</Text> */}
          </Body>
          <Right></Right>
        </Header>

        <RTCView
          objectFit="cover"
          style={{
            height: this.state.remoteVideo ? '100%' : '0%',
            opacity: this.state.remoteVideo ? 1 : 0,
            marginBottom: 50,
            width: '100%',
          }}
          streamURL={this.state.remoteVideo ? this.state.remoteStream.toURL() : this.state.localStream.toURL()}
        />
        <Text>{this.state.remoteVideo ? 'REmote Video' : 'Local Video'}</Text>
        <RTCView
          style={{
            marginLeft: '28%',
            position: 'absolute',
            bottom: 50,
            zIndex: 9999,
            height: this.state.remoteVideo ? '25%' : '0%',
            width: '100%',
          }}
          streamURL={this.state.localStream.toURL()}
        />

        <Button
          onPress={() => this.onDestroyCall()}
          style={{
            width: '100%',
            position: 'absolute',
            flex: 0.05,
            height: 50,
            bottom: 0,
            opacity: this.state.remoteVideo ? 1 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Disconnect Call </Text>
        </Button>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#313131',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontSize: 30,
  },
  rtcview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '80%',
    backgroundColor: 'black',
  },
  rtc: {
    width: '80%',
    height: '100%',
  },
});
