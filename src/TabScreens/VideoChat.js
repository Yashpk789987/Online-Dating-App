import React, {useEffect, useState} from 'react';
import InCallManager from 'react-native-incall-manager';
import baseurl from '../helpers/baseurl';
import io from 'socket.io-client';
import {View, SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  Content,
  List,
  ListItem,
  Body,
  Button,
  Header,
  Item,
  Container,
  Input,
  Left,
  Right,
  Thumbnail,
  Icon,
  Badge,
} from 'native-base';
import {RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices} from 'react-native-webrtc';

export default class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
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
    this.socket = this.props.screenProps.socketRef;
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

    this.socket.on(
      'on-acknowledge-call',
      function(data) {
        if (data.code === 'accepted') {
          this.createOffer(data.socket);
        } else {
          alert('User Rejected Your Call');
        }
      }.bind(this),
    );

    this.pc.onaddstream = e => {
      InCallManager.start({media: 'video'});
      InCallManager.setSpeakerphoneOn(true);
      this.setState({remoteStream: e.stream, remoteVideo: true});
    };

    this.startLocalStream();
  }

  createOffer = async id => {
    try {
      this.setState({targetSocketId: id});
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

  onDestroyCall = () => {
    try {
      this.state.localStream.getTracks().forEach(function(track) {
        track.stop();
      });
      this.state.remoteStream.getTracks().forEach(function(track) {
        track.stop();
      });

      this.pc.removeStream(this.state.remoteStream);
      this.pc.removeStream(this.state.localStream);
      this.pc.close();
      this.pc = null;
      this.pc = undefined;
      this.setState({
        remoteVideo: false,
        localVideo: false,
        remoteStream: '',
        localStream: '',
        answersFrom: {},
        targetSocketId: '',
      });
      InCallManager.stop();
      const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
      this.pc = new RTCPeerConnection(configuration);
      this.startLocalStream();
      ////// EMIT SOCKET FOR DISCONNECTING CALL  ///////
      this.socket.emit('disconnect-call', {
        to: this.state.targetSocketId,
      });
      /////  EMIT SOCKET FOR DISCONNECTING CALL  ///////
      this.setState({targetSocketId: ''});
    } catch (error) {
      console.log('ERROR DESTROY CALL', error);
    }
  };

  //this.createOffer(item.socket_id)

  makeCallRequest = async (id, info) => {
    this.socket.emit('call-request', {
      to: id,
      info: info,
    });
  };

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Body>
            <Item style={{backgroundColor: 'white', width: '165%', height: '75%'}} rounded>
              <Icon name="search" style={{color: 'black'}} />
              <Input placeholder="Search" rounded />
            </Item>
          </Body>

          <Right>
            <Thumbnail small source={require('../../images/g2.jpg')} />
          </Right>
        </Header>
        <Content style={{height: '0%'}}>
          <Text style={{color: 'white', padding: '2%', fontSize: 20, fontWeight: 'bold'}}>Online Users</Text>
          {this.state.remoteVideo ? (
            <></>
          ) : this.props.screenProps.users.length === 0 ? (
            <Text style={{marginLeft: '25%', color: 'white', fontSize: 20}}>No Users Online ...</Text>
          ) : (
            <List>
              {this.props.screenProps.users.map((item, index) => {
                return (
                  <ListItem thumbnail>
                    <Left>
                      <Thumbnail source={{uri: `${baseurl}/user_images/${item.info.profile_pic}`}} />
                    </Left>
                    <Body style={{width: '50%', flex: 1, flexDirection: 'row'}}>
                      <Text style={{color: 'white', fontSize: 16}}>{item.username + '  '}</Text>
                      <View style={{backgroundColor: 'green', width: 15, height: 15, borderRadius: 18 / 2}}></View>
                    </Body>

                    <Right>
                      <TouchableOpacity onPress={() => this.makeCallRequest(item.socket_id, item.info)}>
                        <Icon name="videocam" />
                      </TouchableOpacity>
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Content>
        {this.state.localVideo ? (
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
        ) : (
          <></>
        )}
        {this.state.localVideo ? (
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
        ) : (
          <></>
        )}
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
