import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';

import SignUp from './SignUp';
import Login from './Login';
import Launch from './Launch';

const AuthStack = createStackNavigator(
  {Launch: {screen: Launch}, Login: {screen: Login}, SignUp: {screen: SignUp}},
  {
    headerMode: 'none',
  },
);

export default AuthStack;
