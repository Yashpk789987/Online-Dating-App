import React, {useEffect, useState} from 'react';
import InCallManager from 'react-native-incall-manager';
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
  Spinner,
} from 'native-base';
import {RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices} from 'react-native-webrtc';
import {NavigationActions, StackActions, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import baseurl from '../helpers/baseurl';
import {getData} from '../helpers/httpServices';
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
      loading: false,
      matches_ids: [],
      speaker: true,
      calling_type: 'video',
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
        video:
          this.state.calling_type === 'video'
            ? {
                mandatory: {
                  minWidth: 500,
                  minHeight: 300,
                  minFrameRate: 30,
                },
                facingMode,
                optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
              }
            : false,
      };
      const newStream = await mediaDevices.getUserMedia(constraints);
      await this.pc.addStream(newStream);
      this.setState({localStream: newStream, localVideo: true});
    } catch (error) {
      console.log(error);
    }
  };

  loadMatches = async () => {
    this.setState({loading: true});
    let result = await getData(`like/load-matches-by-profileId/${this.state.user_id}`);
    if (result.ok) {
      let matches_ids = result.matches.map(m => parseInt(m.profile_id));
      this.setState({loading: false, matches_ids});
    } else {
      alert('technical Error ');
    }
  };

  onAddStream = e => {
    try {
      InCallManager.start({media: 'video'});
      InCallManager.setSpeakerphoneOn(true);
      this.setState({remoteStream: e.stream, remoteVideo: true});
    } catch (error) {
      console.log('Add Stream', err);
    }
  };

  componentDidMount = async () => {
    this.props.navigation.addListener('didFocus', async () => {
      try {
        let calling_type = this.props.navigation.getParam('calling_type');
        if (calling_type) {
          await this.setState({calling_type: calling_type});
        }
      } catch (error) {}
      this.loadMatches();
    });
    await this.setState({user_id: this.props.screenProps.me.id});
    await this.loadMatches();
    this.socket = this.props.screenProps.socketRef;
    const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
    this.pc = new RTCPeerConnection(configuration);
    this.pc.onaddstream = this.onAddStream;
    this.socket.on('offer-made', async data => {
      try {
        if (data.calling_type === 'audio') {
          InCallManager.setSpeakerphoneOn(false);
          this.setState({speaker: false});
        }
        this.setState({calling_type: data.calling_type});
        let offer = data.offer;
        await this.pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        let answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(new RTCSessionDescription(answer));
        this.socket.emit('make-answer', {
          answer: answer,
          to: data.socket,
          calling_type: data.calling_type,
        });
      } catch (error) {
        console.log(error);
      }
    });

    this.socket.on(
      'answer-made',
      async function(data) {
        try {
          if (data.calling_type === 'audio') {
            InCallManager.setSpeakerphoneOn(false);
            this.setState({speaker: false});
          }
          this.setState({calling_type: data.calling_type});
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
        this.onDestroyCall();
      }.bind(this),
    );

    this.socket.on(
      'on-acknowledge-call',
      async function(data) {
        if (data.code === 'accepted') {
          await this.setState({calling_type: data.calling_type});
          this.createOffer(data.socket);
        } else {
          alert('User Rejected Your Call');
        }
      }.bind(this),
    );

    this.startLocalStream();
  };

  createOffer = async id => {
    try {
      this.setState({targetSocketId: id});
      const offer = await this.pc.createOffer({offerToReceiveAudio: 1, offerToReceiveVideo: 1});
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

  onDestroyCall = () => {
    try {
      ////// EMIT SOCKET FOR DISCONNECTING CALL  ///////
      this.socket.emit('disconnect-call', {
        to: this.state.targetSocketId,
      });
      /////  EMIT SOCKET FOR DISCONNECTING CALL  ///////
      this.state.localStream.getTracks().forEach(function(track) {
        track.stop();
      });
      this.state.remoteStream.getTracks().forEach(function(track) {
        track.stop();
      });
      this.state.localStream.release();
      this.state.remoteStream.release();
      this.pc.close();
      this.pc = undefined;
      this.setState({
        remoteVideo: false,
        localVideo: false,
        remoteStream: '',
        localStream: '',
        answersFrom: {},
        targetSocketId: '',
        calling_type: 'video',
      });
      InCallManager.stop();
      const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
      this.pc = new RTCPeerConnection(configuration);
      this.pc.onaddstream = this.onAddStream;
      this.startLocalStream();
    } catch (error) {
      console.log('ERROR DESTROY CALL', error);
    }
  };

  makeCallRequest = async (id, info, calling_type) => {
    if (calling_type === 'audio') {
      InCallManager.setSpeakerphoneOn(false);
      this.setState({speaker: false});
    }
    await this.setState({calling_type: calling_type});
    let {me} = this.props.screenProps;
    this.socket.emit('call-request', {
      to: id,
      info: me,
      calling_type: this.state.calling_type,
    });
  };

  toggleMute = async () => {
    await this.setState(state => ({speaker: !state.speaker}));
    InCallManager.setSpeakerphoneOn(this.state.speaker);
  };

  render() {
    const {localVideo, remoteVideo, loading, matches_ids} = this.state;
    const online_users = this.props.screenProps.users.filter(u => matches_ids.includes(parseInt(u.info.id)));
    if (loading) {
      return (
        <View>
          <Header searchBar rounded>
            <Body>
              <Item style={{backgroundColor: 'white', width: '165%', height: '75%'}} rounded>
                <Icon name="search" style={{color: 'black'}} />
                <Input placeholder="Search" rounded />
              </Item>
            </Body>

            <Right>
              <Thumbnail
                defaultSource={require('../../images/profile.png')}
                small
                source={require('../../images/profile.png')}
              />
            </Right>
          </Header>
          <View style={{marginTop: '5%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Spinner color="white" />
            <Text style={{color: 'white', fontSize: 18}}>Loading Online Users...</Text>
          </View>
        </View>
      );
    }
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
            <Thumbnail
              defaultSource={require('../../images/profile.png')}
              small
              source={require('../../images/profile.png')}
            />
          </Right>
        </Header>
        <Content style={{height: '0%'}}>
          <Text style={{color: 'white', padding: '2%', fontSize: 20, fontWeight: 'bold'}}>Online Users</Text>
          {this.state.remoteVideo ? (
            <></>
          ) : online_users.length === 0 ? (
            <Text style={{marginLeft: '25%', color: 'white', fontSize: 20}}>No Users Online ...</Text>
          ) : (
            <List>
              {online_users.map((item, index) => {
                return (
                  <ListItem thumbnail>
                    <Left>
                      <Thumbnail source={{uri: `${baseurl}/user_images/${item.info.profile_pic}`}} />
                    </Left>
                    <Body style={{width: '50%', flex: 1, flexDirection: 'row'}}>
                      <Text style={{color: 'white', fontSize: 16}}>{item.username + '  '}</Text>
                      <View style={{backgroundColor: 'green', width: 15, height: 15, borderRadius: 18 / 2}}></View>
                    </Body>

                    <Right
                      style={{flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <TouchableOpacity
                        onPress={async () => await this.makeCallRequest(item.socket_id, item.info, 'audio')}>
                        <Icon name="call" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.makeCallRequest(item.socket_id, item.info, 'video')}>
                        <Icon name="videocam" />
                      </TouchableOpacity>
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Content>
        {this.state.localVideo && this.state.calling_type === 'video' ? (
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
        {this.state.localVideo && this.state.calling_type === 'video' ? (
          <RTCView
            style={{
              marginLeft: '35%',
              position: 'absolute',
              bottom: 70,
              zIndex: 9999,
              height: this.state.remoteVideo ? '25%' : '0%',
              width: '100%',
            }}
            streamURL={this.state.localStream.toURL()}
          />
        ) : (
          <></>
        )}
        {this.state.calling_type === 'audio' && this.state.localVideo && this.state.remoteVideo ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 18}}>You Both Are On Audio Call...</Text>
          </View>
        ) : null}
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: '25%',
            right: '25%',
            zIndex: 9999,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'space-around',
          }}>
          <Button
            onPress={() => this.toggleMute()}
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              opacity: this.state.remoteVideo ? 1 : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name={this.state.speaker ? 'mic' : 'mic-off'} />
          </Button>
          <Button
            onPress={() => this.onDestroyCall()}
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              marginLeft: '30%',
              opacity: this.state.remoteVideo ? 1 : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="close" />
          </Button>
        </View>
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
