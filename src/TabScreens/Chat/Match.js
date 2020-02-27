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
} from 'native-base';
import {RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices} from 'react-native-webrtc';

export default class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  openChat = item => {
    this.props.screenProps.stackRef.navigate('ChatInterface', {
      user: item,
      socketRef: this.props.screenProps.socketRef,
    });
  };

  render() {
    return (
      <Container>
        <Content style={{height: '0%'}}>
          <Text style={{color: 'white', padding: '2%', fontSize: 20, fontWeight: 'bold'}}>Your Matches</Text>
          {this.props.screenProps.users.length === 0 ? (
            <Text style={{marginLeft: '25%', color: 'white', fontSize: 20}}>No Users Online ...</Text>
          ) : (
            <List>
              {this.props.screenProps.users.map((item, index) => {
                return (
                  <ListItem thumbnail>
                    <Left>
                      <Thumbnail source={require('../../../images/g5.jpg')} />
                    </Left>
                    <Body style={{width: '50%', flex: 1, flexDirection: 'row'}}>
                      <Text style={{color: 'white', fontSize: 16}}>{item.username + '  '}</Text>
                      <View style={{backgroundColor: 'green', width: 15, height: 15, borderRadius: 18 / 2}}></View>
                    </Body>

                    <Right>
                      <TouchableOpacity onPress={() => this.openChat(item)}>
                        <Icon name="arrow-round-forward" />
                      </TouchableOpacity>
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Content>
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
