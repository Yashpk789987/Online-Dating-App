import React, {useEffect} from 'react';
import {Header, Thumbnail, Body, Container, Icon, Input, Item, Right} from 'native-base';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import Home from './Home';
import Chat from './Chat';
import Deck from './Deck';
import Chat2 from '../components/Chat2';
import Profile from './Profile';
import io from 'socket.io-client';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';

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
      screen: Home,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="home" style={{color: tintColor}} size={25} />,
      },
    },
    Deck: {
      screen: Deck,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="globe" style={{color: tintColor}} size={25} />,
      },
    },
    Chat: {
      screen: Chat,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="videocam" style={{color: tintColor}} size={25} />,
      },
    },
    Add: {
      screen: Chat2,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="add-circle" style={{color: tintColor}} size={25} />,
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: <></>,
        tabBarIcon: ({tintColor}) => <Icon name="person" style={{color: tintColor}} size={25} />,
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
  };

  makeCall = async user => {
    await this.setState({targetUser: user});
    this.props.navigation.navigate('VideoChatPack', {socketRef: this.socket, user: user, intent: 'makeCall'});
  };

  addUsers = users => {
    let filteredUsers = users.filter(item => item.user_id != this.state.user_id);
    this.setState({users: filteredUsers});
  };

  componentDidMount() {
    RNCallKeep.setup(options);
    const user_id = this.props.navigation.getParam('_id');
    const username = this.props.navigation.getParam('username');
    this.setState({user_id, username});
    ///////// Connection To IO Server ////////////
    // this.socket = io('http://192.168.1.10:3000', {query: `user_id=${user_id}&username=${username}`});
    this.socket = io('https://video-chat-pk2128.herokuapp.com', {query: `user_id=${user_id}&username=${username}`});

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
  }

  render() {
    const data = Object.assign({users: this.state.users, makeCall: this.makeCall, socketRef: this.socket});
    return (
      <Container>
        <BottomTab screenProps={data} />
      </Container>
    );
  }
}
