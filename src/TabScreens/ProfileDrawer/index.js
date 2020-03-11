import React from 'react';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import Profile from './Profile';
import {Text, Container, Header, Left, Body, Icon, Right} from 'native-base';
import {ScrollView, SafeAreaView, View, Dimensions, TouchableOpacity} from 'react-native';
import ImageLoad from 'react-native-image-placeholder';

import baseurl from '../../helpers/baseurl';

const SCREEN_WIDTH = Dimensions.get('window').width;

class CustomDrawerContent extends React.Component {
  render() {
    const {me} = this.props.screenProps;
    return (
      <View>
        <Header style={{backgroundColor: 'white'}}>
          <Left>
            <Icon name="settings" />
          </Left>
          <Body style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 20}}>{'Settings'}</Text>
          </Body>

          <Right>
            <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()}>
              <Icon style={{color: 'orange'}} name="menu" />
            </TouchableOpacity>
          </Right>
        </Header>

        <ImageLoad
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            overflow: 'hidden',
            marginTop: '8%',
            marginBottom: '8%',
            marginLeft: '22%',
            marginRight: '25%',
          }}
          source={{uri: `${baseurl}/user_images/${me.profile_pic}`}}
        />

        <ScrollView>
          <SafeAreaView style={{flex: 1}} forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItems {...this.props} />
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }
}

const MyDrawerNavigator = createDrawerNavigator(
  {
    Account: {
      screen: Profile,
      navigationOptions: {
        drawerIcon: <Icon name="person" />,
      },
    },
    Invites: {
      screen: Profile,
      navigationOptions: {
        drawerIcon: <Icon name="person-add" />,
      },
    },
    Chat: {
      screen: Profile,
      navigationOptions: {
        drawerIcon: <Icon name="chatbubbles" />,
      },
    },
    Discover: {
      screen: Profile,
      navigationOptions: {
        drawerIcon: <Icon name="globe" />,
      },
    },
    Logout: {
      screen: Profile,
      navigationOptions: {
        drawerIcon: <Icon name="arrow-dropleft-circle" />,
      },
    },
  },
  {
    contentComponent: CustomDrawerContent,
    drawerPosition: 'right',
    drawerWidth: SCREEN_WIDTH / 1.5,
    contentOptions: {
      inactiveTintColor: 'grey',
      activeBackgroundColor: '#D3D3D3',
      activeTintColor: 'black',
    },
  },
);

export default createAppContainer(MyDrawerNavigator);
