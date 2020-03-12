import React, {useEffect, useState} from 'react';

import {ImageBackground, StatusBar, Text, View} from 'react-native';
import {Container, Header, Content, Item, Input, Button, DatePicker, Icon, Spinner} from 'native-base';
import {postDataWithoutToken} from '../helpers/httpServices';
import {putInCache} from '../helpers/cacheTools';
import Geolocation from '@react-native-community/geolocation';

const initialState = {
  username: '',
  phone: '',
  dob: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  latitude: '',
  longitude: '',
  uploading: false,
};

export default function SignUp(props) {
  const [
    {username, email, password, passwordConfirmation, dob, phone, uploading, latitude, longitude},
    setState,
  ] = useState(initialState);
  const [errors, setErrors] = useState([]);
  const clearState = () => {
    setState({...initialState});
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async info => {
        let {latitude, longitude} = info.coords;
        await setState(prevState => ({...prevState, latitude: latitude, longitude: longitude}));
      },
      error => console.log('error', error),
      {enableHighAccuracy: false, timeout: 5000, maximumAge: 10000},
    );
  }, []);

  async function doSignUp() {
    setState(prevState => ({...prevState, uploading: true}));
    let data = {username, email, password, passwordConfirmation, dob, phone, latitude, longitude};

    let result = await postDataWithoutToken(`user/create`, data);
    if (result.ok) {
      let cacheResult = await putInCache('token', result.token);
      setState(prevState => ({...prevState, uploading: false}));
      props.navigation.navigate('App');
    } else {
      setState(prevState => ({...prevState, uploading: false}));
      setErrors(result.errors);
    }
  }
  function setDate(date) {
    let dob = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    setState(prevState => ({...prevState, dob: dob}));
  }

  let usernameError = errors.find(item => item.path === 'username');
  let emailError = errors.find(item => item.path === 'email');
  let phoneError = errors.find(item => item.path === 'phone');
  let dobError = errors.find(item => item.path === 'dob');
  let passwordError = errors.find(item => item.path === 'password');
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
        <Text style={{color: 'white', fontSize: 30}}>Create An Acount</Text>
      </View>
      <Content style={{flex: 1}}>
        <Item
          error={usernameError ? true : false}
          success={usernameError ? false : true}
          rounded
          style={{marginBottom: '1%', marginTop: '2%'}}>
          <Input
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            selectionColor={'white'}
            placeholder="Username"
            onChangeText={text => setState(prevState => ({...prevState, username: text}))}
          />
          {usernameError ? <Icon name="close-circle" /> : <Icon name="checkmark-circle" />}
        </Item>
        <Text style={{paddingLeft: '5%', color: 'white'}}>{usernameError ? usernameError.message : ''}</Text>

        <Item
          success={emailError ? false : true}
          error={emailError ? true : false}
          rounded
          style={{marginBottom: '1%', marginTop: '2%'}}>
          <Input
            onChangeText={text => setState(prevState => ({...prevState, email: text}))}
            placeholderTextColor={'white'}
            keyboardType={'email-address'}
            style={{color: 'white'}}
            placeholder="Email"
          />
          {emailError ? <Icon name="close-circle" /> : <Icon name="checkmark-circle" />}
        </Item>
        <Text style={{paddingLeft: '5%', color: 'white'}}>{emailError ? emailError.message : ''}</Text>
        <Item
          success={phoneError ? false : true}
          error={phoneError ? true : false}
          rounded
          style={{marginBottom: '1%', marginTop: '2%'}}>
          <Input
            keyboardType={'phone-pad'}
            onChangeText={text => setState(prevState => ({...prevState, phone: text}))}
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            placeholder="Phone"
          />
          {phoneError ? <Icon name="close-circle" /> : <Icon name="checkmark-circle" />}
        </Item>
        <Text style={{paddingLeft: '5%', color: 'white'}}>{phoneError ? phoneError.message : ''}</Text>
        <Item
          success={dobError ? false : true}
          error={dobError ? true : false}
          rounded
          style={{marginBottom: '1%', marginTop: '2%'}}>
          <DatePicker
            maximumDate={new Date(2019, 11, 1)}
            locale={'en'}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={true}
            animationType={'slide'}
            androidMode={'calendar'}
            placeHolderText="Select Dob"
            textStyle={{color: 'white'}}
            placeHolderTextStyle={{color: 'white'}}
            onDateChange={setDate}
            disabled={false}
          />
          {dobError ? <Icon name="close-circle" /> : <Icon name="checkmark-circle" />}
        </Item>
        <Text style={{paddingLeft: '5%', color: 'white'}}>{dobError ? dobError.message : ''}</Text>
        <Item
          success={passwordError ? false : true}
          error={passwordError ? true : false}
          rounded
          style={{marginBottom: '1%', marginTop: '2%'}}>
          <Input
            onChangeText={text => setState(prevState => ({...prevState, password: text}))}
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            secureTextEntry={true}
            placeholder="Password"
          />
          {passwordError ? <Icon name="close-circle" /> : <Icon name="checkmark-circle" />}
        </Item>
        <Text style={{paddingLeft: '5%', color: 'white'}}>{passwordError ? passwordError.message : ''}</Text>
      </Content>
      <Button
        block
        disabled={uploading}
        onPress={() => doSignUp()}
        style={{
          backgroundColor: 'orange',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        {uploading ? (
          [<Text style={{color: 'white', fontSize: 20}}>Signing up ...</Text>, <Spinner color="white" />]
        ) : (
          <Text style={{color: 'white', fontSize: 20}}>SignUp</Text>
        )}
      </Button>
    </ImageBackground>
  );
}
