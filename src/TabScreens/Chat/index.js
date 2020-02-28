import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {Body, Button, Header, Item, Container, Input, Left, Right, Thumbnail, Icon, Badge} from 'native-base';
import Match from './Match';
import Like from './Like';

const MaterialTopTabs = createMaterialTopTabNavigator(
  {
    'Your Matches': {
      screen: props => <Match {...props} />,
    },
    'Your Likes ': {
      screen: props => <Like {...props} />,
    },
  },
  {
    swipeEnabled: true,
    lazy: true,
    tabBarOptions: {
      style: {backgroundColor: 'white'},
      activeTintColor: 'black',
      inactiveTintColor: 'grey',
      indicatorStyle: {opacity: 0},
    },
  },
);

const MaterialTopTabsContainer = createAppContainer(MaterialTopTabs);

export default class Chat extends React.Component {
  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Body>
            <Item style={{backgroundColor: 'white', width: '165%', height: '75%'}} rounded>
              <Icon name="search" style={{color: 'black'}} />
              <Input placeholder="Search" rounded />
            </Item>
          </Body>

          <Right>
            <Thumbnail small source={require('../../../images/g2.jpg')} />
          </Right>
        </Header>
        <MaterialTopTabsContainer screenProps={this.props.navigation.getScreenProps()} />
      </Container>
    );
  }
}
