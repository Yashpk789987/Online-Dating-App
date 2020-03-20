import React, {useEffect} from 'react';

import {ImageBackground, StatusBar, Text, View} from 'react-native';

import {Container, Header, Content, Item, Input, Button} from 'native-base';

export default function SignUp(props) {
  useEffect(() => {});
  return (
    <ImageBackground
      style={{
        flex: 1,
        width: null,
        height: null,
        paddingTop: '100%',
        paddingBottom: '0%',
        paddingLeft: '5%',
        paddingRight: '5%',
      }}
      source={require('../../images/bg.jpg')}>
      <View style={{flex: 0.2, alignItems: 'center', paddingTop: '12%'}}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 30}}>Find A Date In Your City</Text>
      </View>
      <View style={{flex: 0.2, alignItems: 'center', paddingTop: '15%'}}>
        <Text style={{color: 'white', fontSize: 18}}>Use Your Facebook , Google Account</Text>
      </View>
      <View style={{flex: 0.2, alignItems: 'center', paddingTop: '10%'}}>
        <Text style={{color: 'white', fontSize: 18}}>Or Mobile Number to Log back In</Text>
      </View>
      <View style={{flex: 0.2, paddingTop: '25%', justifyContent: 'space-between', flexDirection: 'row'}}>
        <Button
          onPress={() => props.navigation.navigate('SignUp')}
          style={{backgroundColor: 'orange', width: '40%', justifyContent: 'center', alignItems: 'center'}}
          rounded>
          <Text style={{color: 'white', fontSize: 20}}>I M New</Text>
        </Button>
        <Button
          onPress={() => props.navigation.navigate('Login')}
          bordered
          style={{width: '40%', justifyContent: 'center', alignItems: 'center'}}
          rounded>
          <Text style={{color: 'orange', fontWeight: 'bold', fontSize: 20}}>Login</Text>
        </Button>
      </View>
      <View style={{flex: 0.2, paddingTop: '20%', alignItems: 'center'}}>
        <Text style={{color: 'orange', fontWeight: 'bold', fontSize: 20}}>I am Forgeted ??</Text>
      </View>
    </ImageBackground>
  );
}
