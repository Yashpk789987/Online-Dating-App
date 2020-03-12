///// I DO NOT KNOW JUST WHY I HAVE MADE THIS ////

//// I WILL CLEAN OUT ONCE I FIGURED OUT //////

import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import TabScreens from '../TabScreens';

const switchNavigator = createSwitchNavigator(
  {
    Home: {
      screen: TabScreens,
    },
  },
  {},
);

const Main = createAppContainer(switchNavigator);

export default Main;
