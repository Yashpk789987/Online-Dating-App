import React, {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {ImageBackground, StatusBar, Text, View} from 'react-native';
import {Container, Header, Content, Item, Input, Button, DatePicker} from 'native-base';

export default function SignUp(props) {
  useEffect(() => {});
  function doSignUp() {
    props.navigation.navigate('Home');
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
          />
        </Item>
        <Item rounded style={{marginBottom: '10%'}}>
          <Input placeholderTextColor={'white'} style={{color: 'white'}} placeholder="Email" />
        </Item>
        <Item rounded style={{marginBottom: '10%'}}>
          <Input placeholderTextColor={'white'} style={{color: 'white'}} placeholder="Phone" />
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
