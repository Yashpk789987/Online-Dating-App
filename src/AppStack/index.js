import React from 'react';
import TabScreens from '../TabScreens';
import PlaceDetail from './PlaceDetail';
import ChatInterface from './ChatInterface';
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
