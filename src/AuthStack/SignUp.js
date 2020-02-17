import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ImageBackground, StatusBar, Text, View} from 'react-native';
import {Container, Header, Content, Item, Input, Button, DatePicker} from 'native-base';
import {postDataWithoutToken} from '../helpers/httpServices';

const initialState = {
  username: '',
  phone: '',
  dob: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  uploading: false,
};

export default function SignUp(props) {
  const [{username, email, password, passwordConfirmation, dob, phone}, setState] = useState(initialState);

  const clearState = () => {
    setState({...initialState});
  };

  function doSignUp() {
    setState(prevState => ({...prevState, uploading: true}));
    let data = {username, email, password, passwordConfirmation, dob, phone};
    console.log(data);
    postDataWithoutToken(`/user/create`, data);
    //props.navigation.navigate('Home');
  }
  function setDate(date) {
    console.log(date);
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
        <Text style={{color: 'white', fontSize: 30}}>Create An Acount</Text>
      </View>
      <Content style={{flex: 1}}>
        <Item rounded style={{marginBottom: '10%'}}>
          <Input
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            selectionColor={'white'}
            placeholder="Username"
            onChangeText={text => setState(prevState => ({...prevState, username: text}))}
          />
        </Item>
        <Item rounded style={{marginBottom: '10%'}}>
          <Input
            onChangeText={text => setState(prevState => ({...prevState, email: text}))}
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            placeholder="Email"
          />
        </Item>
        <Item rounded style={{marginBottom: '10%'}}>
          <Input
            onChangeText={text => setState(prevState => ({...prevState, phone: text}))}
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            placeholder="Phone"
          />
        </Item>
        <Item rounded style={{marginBottom: '10%'}}>
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
        </Item>
        <Item rounded style={{marginBottom: '10%'}}>
          <Input
            onChangeText={text => setState(prevState => ({...prevState, password: text}))}
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            secureTextEntry={true}
            placeholder="Password"
          />
        </Item>
      </Content>
      <Button
        onPress={() => doSignUp()}
        style={{backgroundColor: 'orange', width: '100%', justifyContent: 'center', alignItems: 'center'}}
        rounded>
        <Text style={{color: 'white', fontSize: 20}}>SignUp</Text>
      </Button>
    </ImageBackground>
  );
}
