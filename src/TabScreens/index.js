import React, {useEffect} from 'react';
import {Header, Thumbnail, Body, Container, Icon, Input, Item, Right} from 'native-base';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {Dimensions} from 'react-native';
import io from 'socket.io-client';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';
import firebase from 'react-native-firebase';
import Icon_ from 'react-native-vector-icons/FontAwesome';

import Home from './Home';
import VideoChat from './VideoChat';
import VoipAndVideoChat from './VoipAndVideoChat';
import Chat from './Chat/index';
import Deck from './Deck';
import NearbyLocations from './NearbyLocations';
import ProfileDrawer from './ProfileDrawer/';
import Profile from './Profile';

import baseurl from '../helpers/baseurl';
import {getDataFromToken} from '../helpers/tokenutils';
import {removeFromCache, changeInCache} from '../helpers/cacheTools';
import {postData} from '../helpers/httpServices';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
        tabBarIcon: ({tintColor}) => <Icon_ name="wechat" style={{color: tintColor}} size={25} />,
      },
    },
    Profile: {
      screen: ProfileDrawer,
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
    lazy: false,
    tabBarOptions: {
      inactiveBackgroundColor: '#3b3b3b',
      activeBackgroundColor: '#3b3b3b',
      inactiveTintColor: 'white',
      activeTintColor: 'orange',
      style: {height: SCREEN_HEIGHT * 0.08},
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
    connected_to_io: false,
    go_to_chat_interface: false,
    notification_object: {},
    sender: {},
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
    await this.checkPermission();
    await this.messageListener();
    ///////// Connection To IO Server ////////////
    this.socket = io(baseurl, {query: `user_id=${user_id}&username=${username}&user=${JSON.stringify(user)}`});
    this.setState({connected_to_io: true});
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

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  };

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      let data = {userId: this.state.user_id, token: fcmToken};
      let result = await postData('user/update-token', data);
      if (result.ok) {
        await changeInCache('token', result.token);
        let result_ = await getDataFromToken();
        if (result_.ok) {
          const {id, username} = result_.data;
          await this.setState({user_id: id, username, user: result_.data});
        } else {
          await removeFromCache('token');
          this.props.screenProps.authRef.navigate('AuthLoading');
          return;
        }
      }
    } else {
      this.showAlert('Failed', 'No token received');
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  messageListener = async () => {
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      const local = new firebase.notifications.Notification()
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle('New Message')
        .setSound('default')
        .android.setLargeIcon(notification.android.largeIcon)
        .setBody(notification.body)
        .setData({
          user: notification.data.user,
        });

      local.android.setChannelId(notification.android.channelId).android.setSmallIcon('ic_launcher');

      firebase.notifications().displayNotification(local);
    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async notificationOpen => {
      if (notificationOpen) {
        await this.setState({go_to_chat_interface: true, notification_object: notificationOpen});
      }
    });

    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      await this.setState({go_to_chat_interface: true, notification_object: notificationOpen});
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  render() {
    const data = Object.assign({
      users: this.state.users,
      makeCall: this.makeCall,
      socketRef: this.socket,
      stackRef: this.props.navigation,
      authRef: this.props.screenProps.authRef,
      me: this.state.user,
    });
    if (this.state.go_to_chat_interface && this.state.connected_to_io) {
      let {user} = this.state.notification_object.notification.data;
      this.props.navigation.navigate('ChatInterface', {
        sender: this.state.user,
        user: JSON.parse(user),
        user_id: this.state.user_id,
        socketRef: this.socket,
      });
    }
    return (
      <Container>
        <BottomTab screenProps={data} />
      </Container>
    );
  }
}
