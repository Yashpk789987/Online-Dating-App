// import React from 'react';
// import TabScreens from '../TabScreens';
// import PlaceDetail from './PlaceDetail';
// import ChatInterface from './ChatInterface';
// import ViewProfile from './ViewProfile';
// import {createStackNavigator} from 'react-navigation-stack';
// import {createAppContainer} from 'react-navigation';

// const App = createAppContainer(
//   createStackNavigator(
//     {
//       Home: {
//         screen: TabScreens,
//       },
//       PlaceDetail: {
//         screen: PlaceDetail,
//       },
//       ChatInterface: {
//         screen: ChatInterface,
//       },
//       ViewProfile: {
//         screen: ViewProfile,
//       },
//     },
//     {
//       headerMode: 'none',
//     },
//   ),
// );

// export default class AppStack extends React.Component {
//   render() {
//     return <App screenProps={{...this.props, authRef: this.props.navigation}} />;
//   }
// }

import React from 'react';
import TabScreens from '../TabScreens';
import PlaceDetail from './PlaceDetail';
import ChatInterface from './ChatInterface';
import ViewProfile from './ViewProfile';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import PushNotification from 'react-native-push-notification';

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
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        // console.log('NOTIFICATION:', notification);

        console.log('I am calling ...');
        alert('hello....');
      },
      // Android only
      senderID: '388473744387',
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  render() {
    return <App screenProps={{...this.props, authRef: this.props.navigation}} />;
  }
}
