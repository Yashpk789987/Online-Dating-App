///// I DO NOT KNOW JUST WHY I HAVE MADE THIS ////

//// I WILL CLEAN OUT ONCE I FIGURED OUT //////

import React, {useEffect, useState} from 'react';
import InCallManager from 'react-native-incall-manager';
import io from 'socket.io-client';
import {View, SafeAreaView, StyleSheet, Text, Button} from 'react-native';
import {Content, List, ListItem, Body, Container} from 'native-base';
import {RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices} from 'react-native-webrtc';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      answersFrom: {},
      localVideo: false,
      remoteVideo: false,
      localStream: '',
      remoteStream: '',
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
    this.socket = io('http://192.168.1.10:3000');
    const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
    this.pc = new RTCPeerConnection(configuration);
    this.socket.on(
      'add-users',
      function(data) {
        this.setState({users: data.users});
      }.bind(this),
    );

    this.socket.on(
      'remove-user',
      function(id) {
        let temp_users = this.state.users.splice(this.state.users.indexOf(id), 1);
        this.setState({users: temp_users});
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
    this.pc.onaddstream = e => {
      InCallManager.start({media: 'video'});
      InCallManager.setSpeakerphoneOn(true);
      this.setState({remoteStream: e.stream, remoteVideo: true});
    };

    this.startLocalStream();
  }

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
    return (
      <View style={{backgroundColor: 'white'}}>
        <Content style={{height: '10%'}}>
          <List>
            {this.state.users.map((item, index) => {
              return (
                <ListItem onPress={() => this.createOffer(item)}>
                  <Body>
                    <Text style={{color: 'black'}}>{item}</Text>
                  </Body>
                </ListItem>
              );
            })}
          </List>
        </Content>
        {this.state.localVideo ? (
          <RTCView
            objectFit="cover"
            style={{
              height: this.state.remoteVideo ? '100%' : '85%',
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
