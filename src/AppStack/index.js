import React from 'react';
import TabScreens from '../TabScreens';
import PlaceDetail from './PlaceDetail';
import ChatInterface from './ChatInterface';
import ViewProfile from './ViewProfile';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

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
  render() {
    return <App screenProps={{...this.props, authRef: this.props.navigation}} />;
  }
}
