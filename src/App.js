import React from 'react';
import getTheme from '../native-base-theme/components';

import {StyleProvider, Text} from 'native-base';

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './components/Home';
import Game from './components/Game';
import Deck from './components/Deck';
import VideoChat from './components/VideoChat';
import VideoChatWithSocketIO from './components/VideoChatWithSocketIO';
import CallManager from './components/CallManager';
import VideoCall from './components/VideoCall';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import VideoChatPack from './VideoChatPack';

import Main from './components/Main';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import {PermissionsAndroid} from 'react-native';

console.disableYellowBox = true;

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
      VideoChatPack: VideoChatPack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

export default class App extends React.Component {
  askPermissions = async () => {
    let response = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    if (Object.values(response).some(item => item === 'denied')) {
      askPermissions();
    } else {
    }
  };
  componentDidMount() {
    this.askPermissions();
  }
  render() {
    return (
      <StyleProvider style={getTheme()}>
        <AppContainer />
      </StyleProvider>
    );
  }
}
