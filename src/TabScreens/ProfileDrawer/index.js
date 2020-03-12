import React from 'react';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';

import {Text, Container, Header, Left, Body, Icon, Right} from 'native-base';
import {ScrollView, SafeAreaView, View, Dimensions, TouchableOpacity} from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import {removeFromCache} from '../../helpers/cacheTools';
import {postData} from '../../helpers/httpServices';
import baseurl from '../../helpers/baseurl';

import Invites from './Invites';
import Profile from './Profile';
import Logout from './Logout';

const SCREEN_WIDTH = Dimensions.get('window').width;

class CustomDrawerContent extends React.Component {
  logout = async () => {
    let response = await postData(`user/logout`, {userId: this.props.screenProps.me.id});
    if (response.ok) {
      await removeFromCache('token');
      this.props.screenProps.authRef.navigate('Login');
    }
  };
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
          defaultSource={require('../../../images/profile.png')}
          source={{uri: `${baseurl}/user_images/${me.profile_pic}`}}
        />

        <ScrollView>
          <SafeAreaView style={{flex: 1}} forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItems
              {...{
                ...this.props,
                onItemPress: async ({route, focused}) => {
                  let flag = true;
                  switch (route.key) {
                    case 'Chat':
                      flag = false;
                      await this.props.navigation.toggleDrawer();
                      await this.props.navigation.navigate('Account');
                      this.props.screenProps.tabsRef.navigate('Chat');
                      break;
                    case 'Discover':
                      flag = false;
                      await this.props.navigation.toggleDrawer();
                      this.props.navigation.navigate('Account');
                      this.props.screenProps.tabsRef.navigate('Home');
                      break;
                    case 'Logout':
                      this.logout();
                      break;
                    default:
                      break;
                  }
                  if (flag) {
                    this.props.onItemPress({route, focused});
                  }
                },
              }}
            />
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
      screen: Invites,
      navigationOptions: {
        drawerIcon: <Icon name="person-add" />,
      },
    },
    Chat: {
      screen: () => <></>,
      navigationOptions: {
        drawerIcon: <Icon name="chatbubbles" />,
      },
    },
    Discover: {
      screen: () => <></>,
      navigationOptions: {
        drawerIcon: <Icon name="globe" />,
      },
    },
    Logout: {
      screen: () => <Logout />,
      navigationOptions: {
        drawerIcon: <Icon name="arrow-dropleft-circle" />,
      },
    },
  },
  {
    contentComponent: CustomDrawerContent,
    drawerPosition: 'right',
    drawerType: 'slide',
    overlayColor: 'transparent',
    drawerWidth: SCREEN_WIDTH / 1.5,
    contentOptions: {
      inactiveTintColor: 'grey',
      activeBackgroundColor: '#D3D3D3',
      activeTintColor: 'black',
    },
  },
);

const Drawer = createAppContainer(MyDrawerNavigator);

export default class ProfileDrawer extends React.Component {
  render() {
    let screenProps = {...this.props.navigation.getScreenProps(), tabsRef: this.props.navigation};
    return <Drawer screenProps={screenProps} />;
  }
}
