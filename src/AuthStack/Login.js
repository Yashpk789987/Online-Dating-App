import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ImageBackground, StatusBar, Text, View} from 'react-native';
import {Container, Header, Content, Item, Input, Button} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
export default function Login(props) {
  useEffect(() => {});
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  async function doLogin() {
    if (password == '123') {
      let _id = Math.floor(1000000000 + Math.random() * 9000000000);
      console.log(_id);
      let user = {
        _id: _id,
        username: username,
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      props.navigation.navigate('App', user);
    }
  }
  return (
    <ImageBackground
      style={{
        flex: 1,
        width: null,
        height: null,
        paddingTop: '15%',
        paddingLeft: '5%',
        paddingRight: '5%',
      }}
      source={require('../../images/bg.jpg')}>
      <View style={{flex: 0.2, alignItems: 'center'}}>
        <Text style={{color: 'white', fontSize: 30}}>Sign Into Your Account</Text>
      </View>
      <Content style={{flex: 1}}>
        <Item rounded style={{marginBottom: '10%'}}>
          <Input
            placeholder="Username"
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            onChangeText={text => setUsername(text)}
          />
        </Item>

        <Item rounded style={{marginBottom: '10%'}}>
          <Input
            secureTextEntry={true}
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            placeholder="Password"
            onChangeText={text => setPassword(text)}
          />
        </Item>
      </Content>
      <Button
        onPress={() => doLogin()}
        style={{backgroundColor: 'orange', width: '100%', justifyContent: 'center', alignItems: 'center'}}
        rounded>
        <Text style={{color: 'white', fontSize: 20}}>Login</Text>
      </Button>
    </ImageBackground>
  );
}
