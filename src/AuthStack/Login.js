import React, {useEffect, useState} from 'react';
import {ImageBackground, StatusBar, Text, View} from 'react-native';
import {Container, Header, Content, Item, Input, Button, Spinner} from 'native-base';

import {withFormik} from 'formik';
import {postDataWithoutToken} from '../helpers/httpServices';
import {putInCache} from '../helpers/cacheTools';

const Login = function({values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting}) {
  useEffect(() => {});
  let [usernameError, setUsernameError] = useState('');
  let [passwordError, setPasswordError] = useState('');

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
            placeholder="Username  Or  Mobile No. Or  Email Id"
            placeholderTextColor={'white'}
            onBlur={handleBlur('email_mobile_username')}
            style={{color: 'white'}}
            onChangeText={handleChange('email_mobile_username')}
          />
        </Item>

        <Item rounded style={{marginBottom: '10%'}}>
          <Input
            secureTextEntry={true}
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            placeholder="Password"
            onBlur={handleBlur('password')}
            onChangeText={handleChange('password')}
          />
        </Item>
      </Content>
      <Button
        block
        disabled={isSubmitting}
        onPress={handleSubmit}
        style={{
          backgroundColor: 'orange',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        {isSubmitting ? (
          [<Text style={{color: 'white', fontSize: 20}}>Logging In ...</Text>, <Spinner color="white" />]
        ) : (
          <Text style={{color: 'white', fontSize: 20}}>Login</Text>
        )}
      </Button>
    </ImageBackground>
  );
};

export default withFormik({
  mapPropsToValues: () => ({email_mobile_username: '', password: ''}),
  handleSubmit: async (values, {props: {navigation}, setSubmitting}) => {
    let result = await postDataWithoutToken(`user/login`, values);
    if (result.ok) {
      let cacheResult = await putInCache('token', result.token);
      setSubmitting(false);
      navigation.navigate('Home');
      setSubmitting(false);
    } else {
      ///// show Errors
      setSubmitting(false);
      alert(result.error.msg);
    }
  },
})(Login);
