import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import SignUp from './SignUp';
import Launch from './Launch';
import Login from './Login';
import TabScreens from '../TabScreens';

const switchNavigator = createSwitchNavigator(
  {
    // Launch: {
    //   screen: Launch,
    // },
    // SignUp: {
    //   screen: SignUp,
    // },
    // Login: {
    //   screen: Login,
    // },
    Home: {
      screen: TabScreens,
    },
  },
  {},
);

const Main = createAppContainer(switchNavigator);

export default Main;
