import React, {useEffect} from 'react';
import {Header, Thumbnail, Body, Container, Icon, Input, Item, Right} from 'native-base';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import Home from './Home';
import VideoChat from './VideoChat';
import Chat from './Chat/index';
import Deck from './Deck';
import NearbyLocations from './NearbyLocations';

import Profile from './Profile';
import io from 'socket.io-client';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';
import {getDataFromToken} from '../helpers/tokenutils';
import {removeFromCache} from '../helpers/cacheTools';
import baseurl from '../helpers/baseurl';

const options = {
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
  },
};

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Deck,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="home" style={{color: tintColor}} size={25} />,
      },
    },

    VideoChat: {
      screen: VideoChat,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="videocam" style={{color: tintColor}} size={25} />,
      },
    },
    Chat: {
      screen: Chat,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="chatboxes" style={{color: tintColor}} size={25} />,
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="person" style={{color: tintColor}} size={25} />,
      },
    },
    NearbyLocations: {
      screen: NearbyLocations,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="wine" style={{color: tintColor}} size={25} />,
      },
    },
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      inactiveBackgroundColor: '#3b3b3b',
      activeBackgroundColor: '#3b3b3b',
      inactiveTintColor: 'white',
      activeTintColor: 'orange',
    },
  },
);

const BottomTab = createAppContainer(TabNavigator);

export default class App extends React.Component {
  state = {
    users: [],
    user_id: '',
    username: '',
    targetUser: {},
    user: {},
  };

  makeCall = async user => {
    await this.setState({targetUser: user});
    this.props.navigation.navigate('VideoChatPack', {socketRef: this.socket, user: user, intent: 'makeCall'});
  };

  addUsers = users => {
    let filteredUsers = users.filter(item => item.user_id != this.state.user_id);
    this.setState({users: filteredUsers});
  };

  componentDidMount = async () => {
    RNCallKeep.setup(options);
    let result = await getDataFromToken();
    if (result.ok) {
      const {id, username} = result.data;
      await this.setState({user_id: id, username, user: result.data});
    } else {
      await removeFromCache('token');
      this.props.screenProps.authRef.navigate('AuthLoading');
      return;
    }
    const {user_id, username, user} = this.state;
    ///////// Connection To IO Server ////////////
    this.socket = io(baseurl, {query: `user_id=${user_id}&username=${username}&user=${JSON.stringify(user)}`});
    //this.socket = io('https://video-chat-pk2128.herokuapp.com', {query: `user_id=${user_id}&username=${username}`});

    //////// Receiving List of all already connected users on new connection
    this.socket.on(
      'self-acknowledge',
      function(data) {
        this.addUsers(data.users);
      }.bind(this),
    );

    ////// Receiving List Of all users when new one is connected
    this.socket.on(
      'add-users',
      function(data) {
        this.addUsers(data.users);
      }.bind(this),
    );

    ///// Receiving List of all users when any one is disconnected
    this.socket.on(
      'remove-user',
      function(data) {
        this.addUsers(data.users);
      }.bind(this),
    );
  };

  render() {
    const data = Object.assign({
      users: this.state.users,
      makeCall: this.makeCall,
      socketRef: this.socket,
      stackRef: this.props.navigation,
      authRef: this.props.screenProps.authRef,
    });
    return (
      <Container>
        <BottomTab screenProps={data} />
      </Container>
    );
  }
}
