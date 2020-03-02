import firebase from 'react-native-firebase';

import React from 'react';
import TabScreens from '../TabScreens';
import PlaceDetail from './PlaceDetail';
import ChatInterface from './ChatInterface';
import ViewProfile from './ViewProfile';
import {Alert} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import type {Notification} from 'react-native-firebase';

const App = createAppContainer(
  createStackNavigator(
    {
      Home: {
        screen: TabScreens,
      },
      PlaceDetail: {
        screen: PlaceDetail,
      },
      ChatInterface: {
        screen: ChatInterface,
      },
      ViewProfile: {
        screen: ViewProfile,
      },
    },
    {
      headerMode: 'none',
    },
  ),
);

export default class AppStack extends React.Component {
  componentDidMount() {
    this.checkPermission();
    this.messageListener();
  }

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
      console.log(fcmToken);
      this.showAlert('Your Firebase Token is:', fcmToken);
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
      const {title, body} = notification;
      console.log('NHU', notification);
      const localNotification = new firebase.notifications.Notification({
        sound: 'default',
        show_in_foreground: true,
      });
      localNotification.android.setChannelId('6327637');
      firebase
        .notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));

      this.showAlert(title, body);
    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => {
      const {title, body} = notificationOpen.notification;
      console.log('I am calling 1', notificationOpen);
      this.showAlert(title, body);
    });

    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      console.log('I am calling 2', notificationOpen);
      this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  showAlert = (title, message) => {
    Alert.alert(title, message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {cancelable: false});
  };

  render() {
    return <App screenProps={{...this.props, authRef: this.props.navigation}} />;
  }
}
