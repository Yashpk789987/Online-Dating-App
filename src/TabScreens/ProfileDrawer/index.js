import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import Profile from './Profile';

class CustomDrawerContent extends React.Component {
  render() {
    return <Text></Text>;
  }
}

const MyDrawerNavigator = createDrawerNavigator(
  {
    Profile: {
      screen: Profile,
    },
  },
  {drawerPosition: 'right'},
);

export default createAppContainer(MyDrawerNavigator);
