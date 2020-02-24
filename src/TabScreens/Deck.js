import React from 'react';
import {
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon as Icon_,
  Container,
  Item,
  Input,
  Thumbnail,
  Spinner,
  DeckSwiper,
  Card,
  CardItem,
  cardBody,
} from 'native-base';
import {ScrollView, StyleSheet, Text, View, Dimensions, Animated, PanResponder, TouchableOpacity} from 'react-native';
import {getData} from '../helpers/httpServices';
import {getDataFromToken} from '../helpers/tokenutils';
import ImageSliderForDeck from '../DumbComponents/ImageSliderForDeck';

import Icon from 'react-native-vector-icons/Ionicons';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

let SCREEN_HEIGHT = Dimensions.get('window').height;
SCREEN_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT * 0.35;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Users = [
  {id: '1', uri: require('../../images/g5.jpg')},
  {id: '2', uri: require('../../images/g6.jpg')},
  {id: '3', uri: require('../../images/g7.jpg')},
  {id: '4', uri: require('../../images/g8.jpg')},
];

export default class Deck extends React.Component {
  constructor() {
    super();

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      users: [],
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.setState({loading: true});
    let result = await getDataFromToken();
    if (result.ok) {
      let {id} = result.data;
      let response = await getData(`user/all-users-except-self/${id}`);
      this.setState({loading: false, users: response.users});
    }
  };

  renderUsers = () => {
    return (
      <DeckSwiper
        looping={false}
        dataSource={this.state.users}
        renderItem={item => (
          <Card style={{backgroundColor: 'white'}}>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: `${baseurl}/user_images/${item.profile_pic}`}} />
                <Body>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.username}</Text>
                  <Text note>{item.username}</Text>
                </Body>
              </Left>
            </CardItem>
            <ImageSliderForDeck userId={item.id} />
            <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button transparent>
                <Icon_ style={{color: 'orange'}} active name="thumbs-up" />
                <Text style={{color: 'orange'}}>12 Likes</Text>
              </Button>
              <Button transparent onPress={() => alert('hello...')}>
                <Text style={{color: 'orange'}}>View Profile</Text>
                <Icon_ style={{color: 'orange'}} active name="arrow-forward" />
              </Button>
            </View>
          </Card>
        )}
      />
    );
  };

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Body>
            <Item style={{backgroundColor: 'white', width: '165%', height: '75%'}} rounded>
              <Icon_ name="search" style={{color: 'black'}} />
              <Input placeholder="Search" rounded />
            </Item>
          </Body>

          <Right>
            <Thumbnail small source={require('../../images/g2.jpg')} />
          </Right>
        </Header>
        <View style={{flex: 1}}>
          {this.state.loading ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Spinner color="white" />
            </View>
          ) : (
            <View style={{flex: 1}}>{this.renderUsers()}</View>
          )}
          <View style={{height: 60}}></View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
