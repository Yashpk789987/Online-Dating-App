import React from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('token'));
    let res = await fetch(`https://video-chat-pk2128.herokuapp.com/connect`);
    this.props.navigation.navigate(token ? 'App' : 'Auth', token);
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
