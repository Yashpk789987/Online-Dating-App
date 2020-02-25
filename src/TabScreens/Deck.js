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
import {getData, postData} from '../helpers/httpServices';
import {getDataFromToken} from '../helpers/tokenutils';
import ImageSliderForDeck from '../DumbComponents/ImageSliderForDeck';

import Icon from 'react-native-vector-icons/Ionicons';

import CardStack, {Card as Card_} from 'react-native-card-stack-swiper';

let SCREEN_HEIGHT = Dimensions.get('window').height;
SCREEN_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT * 0.35;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Deck extends React.Component {
  constructor() {
    super();

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      users: [],
      loading: false,
      userId: -1,
    };
  }

  loadUsers = async () => {
    this.setState({loading: true});
    let result = await getDataFromToken();
    if (result.ok) {
      let {id} = result.data;
      let response = await getData(`user/all-users-except-self/${id}`);
      await this.setState({loading: false, users: response.users});
      return id;
    }
  };

  makeLike = async index => {
    let profile = this.state.users[index];
    let data = {profileId: profile.id, userId: this.state.userId};
    let response = await postData(`like/create`, data);
  };

  componentDidMount = async () => {
    let userId = await this.loadUsers();
    this.setState({userId});
  };

  renderUsers = () => {
    return (
      <CardStack
        ref={swiper => {
          this.swiper = swiper;
        }}
        onSwipedRight={index => {
          this.makeLike(index);
        }}>
        {this.state.users.map(item => {
          return (
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
                <Button
                  transparent
                  onPress={() => this.props.screenProps.stackRef.navigate('ViewProfile', {userId: item.id})}>
                  <Text style={{color: 'orange'}}>View Profile</Text>
                  <Icon_ style={{color: 'orange'}} active name="arrow-forward" />
                </Button>
              </View>
            </Card>
          );
        })}
      </CardStack>
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
          <View style={{flex: 0.15, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                borderWidth: 3,
                borderColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: 'white',
                borderRadius: 25,
              }}
              onPress={() => {
                this.swiper.swipeLeft();
              }}>
              <Icon name={'md-thumbs-down'} size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 3,
                borderColor: 'orange',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: 'white',
                borderRadius: 25,
              }}
              onPress={() => {
                this.loadUsers();
              }}>
              <Icon name={'md-refresh'} size={30} color="orange" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 3,
                borderColor: '#01a699',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: 'white',
                borderRadius: 25,
              }}
              onPress={() => {
                this.swiper.swipeRight();
              }}>
              <Icon name={'md-thumbs-up'} size={30} color="#01a699" />
            </TouchableOpacity>
          </View>
        </View>
        <View></View>
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
