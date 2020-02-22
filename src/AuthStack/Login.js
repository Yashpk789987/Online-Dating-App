import React from 'react';
import {ImageBackground, StatusBar, Text, View} from 'react-native';
import {Container, Header, Content, Item, Input, Button, Spinner, Icon} from 'native-base';

import {withFormik} from 'formik';
import {postDataWithoutToken} from '../helpers/httpServices';
import {putInCache} from '../helpers/cacheTools';

const Login = function({values, touched, handleChange, handleBlur, handleSubmit, isSubmitting, errors}) {
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
        <Item
          error={errors.path && errors.path === 'user' ? true : false}
          success={errors.path && errors.path === 'user' ? false : true}
          rounded
          style={{marginBottom: '1%', marginTop: '5%'}}>
          <Input
            placeholder="Username  Or  Mobile No. Or  Email Id"
            placeholderTextColor={'white'}
            onBlur={handleBlur('email_mobile_username')}
            style={{color: 'white'}}
            onChangeText={handleChange('email_mobile_username')}
          />
          {errors.path && errors.path === 'user' ? <Icon name="close-circle" /> : <Icon name="checkmark-circle" />}
        </Item>
        <Text style={{paddingLeft: '5%', color: 'white'}}>
          {errors.path && errors.path === 'user' ? errors.msg : ''}
        </Text>
        <Item
          error={errors.path && errors.path === 'password' ? true : false}
          success={errors.path && errors.path === 'password' ? false : true}
          rounded
          style={{marginBottom: '1%', marginTop: '5%'}}>
          <Input
            secureTextEntry={true}
            placeholderTextColor={'white'}
            style={{color: 'white'}}
            placeholder="Password"
            onBlur={handleBlur('password')}
            onChangeText={handleChange('password')}
          />
          {errors.path && errors.path === 'password' ? <Icon name="close-circle" /> : <Icon name="checkmark-circle" />}
        </Item>
        <Text style={{paddingLeft: '5%', color: 'white'}}>
          {errors.path && errors.path === 'password' ? errors.msg : ''}
        </Text>
        <Button
          block
          disabled={isSubmitting}
          onPress={handleSubmit}
          style={{
            marginTop: '5%',
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
      </Content>
    </ImageBackground>
  );
};

export default withFormik({
  mapPropsToValues: () => ({email_mobile_username: '', password: ''}),
  handleSubmit: async (values, {props: {navigation}, setSubmitting, setErrors}) => {
    let result = await postDataWithoutToken(`user/login`, values);
    if (result.ok) {
      let cacheResult = await putInCache('token', result.token);
      navigation.navigate('App');
      setSubmitting(false);
    } else {
      ///// show Errors
      setSubmitting(false);
      setErrors(result.error);
    }
  },
})(Login);
