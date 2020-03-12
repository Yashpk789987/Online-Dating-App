///// I DO NOT KNOW JUST WHY I HAVE MADE THIS ////

//// I WILL CLEAN OUT ONCE I FIGURED OUT //////

import React from 'react';
import InCallManager from 'react-native-incall-manager';
import {View} from 'react-native';
import {Content, List, ListItem, Body, Container, Text} from 'native-base';
import {RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices} from 'react-native-webrtc';

export default class VideoChatPack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answersFrom: {},
      localVideo: false,
      remoteVideo: false,
      localStream: '',
      remoteStream: '',
    };
  }

  componentDidMount = async () => {
    this.socket = this.props.navigation.getParam('socketRef');

    let user = this.props.navigation.getParam('user');
    let intent = this.props.navigation.getParam('intent');
    const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
    this.pc = new RTCPeerConnection(configuration);

    this.startLocalStream();
    if (intent == 'makeCall') {
      this.createOffer(user.socket_id);
    } else if (intent == 'receiveCall') {
      let data = this.props.navigation.getParam('data');
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
    }
    this.socket.on(
      'answer-made',
      async function(data) {
        try {
          await this.pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          if (!this.state.answersFrom[data.socket]) {
            this.createOffer(data.socket);
            this.state.answersFrom[data.socket] = true;
          }
        } catch (error) {
          console.log(error);
        }
      }.bind(this),
    );
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
    this.pc.onaddstream = e => {
      console.log('stream added');

      InCallManager.start({media: 'video'});
      InCallManager.setSpeakerphoneOn(true);
      this.setState({remoteStream: e.stream, remoteVideo: true});
    };
  };
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

  createOffer = async id => {
    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(new RTCSessionDescription(offer));
      this.socket.emit('make-offer', {
        offer: offer,
        to: id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    console.log(this.state);
    return (
      <Container style={{backgroundColor: 'white'}}>
        <View style={{backgroundColor: 'white', opacity: this.state.remoteVideo ? 1 : 0}}>
          {this.state.localVideo ? (
            <RTCView
              objectFit="cover"
              style={{
                height: this.state.remoteVideo ? '100%' : 0,
                opacity: this.state.remoteVideo ? 1 : 0,
                width: '100%',
              }}
              streamURL={this.state.remoteVideo ? this.state.remoteStream.toURL() : this.state.localStream.toURL()}
            />
          ) : (
            <></>
          )}
          {this.state.localVideo ? (
            <RTCView
              style={{
                marginLeft: '28%',
                position: 'absolute',
                bottom: 0,
                zIndex: 9999,
                height: this.state.remoteVideo ? '25%' : '50%',
                width: '100%',
              }}
              streamURL={this.state.localStream.toURL()}
            />
          ) : (
            <></>
          )}
        </View>
      </Container>
    );
  }
}
