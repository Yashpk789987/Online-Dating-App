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
  showAlert = (title, message) => {
    Alert.alert(title, message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {cancelable: false});
  };

  render() {
    return <App screenProps={{...this.props, authRef: this.props.navigation}} />;
  }
}
