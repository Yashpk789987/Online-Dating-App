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
  ListItem,
} from 'native-base';

import ImageLoad from 'react-native-image-placeholder';

import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  FlatList,
  Keyboard,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import CardStack, {Card as Card_} from 'react-native-card-stack-swiper';

import {getData, postData} from '../helpers/httpServices';
import {getDataFromToken} from '../helpers/tokenutils';
import ImageSliderForDeck from '../DumbComponents/ImageSliderForDeck';
import DeckCard from '../DumbComponents/DeckCard';

import baseurl from '../helpers/baseurl';

let SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      users: [],
      filteredUsers: [],
      loading: false,
      userId: -1,
      modal: false,
      targetSocketId: -1,
      caller_info: {},
      me: {},
      searchOpacity: 0,
    };
  }

  loadUsers = async () => {
    this.setState({loading: true});
    let result = await getDataFromToken();
    if (result.ok) {
      let {id} = result.data;
      this.setState({me: result.data});
      let response = await getData(`user/all-users-except-self/${id}`);
      await this.setState({filteredUsers: response.users, users: response.users});
      return id;
    }
  };

  makeLike = async index => {
    let profile = this.state.users[index];
    let data = {profileId: profile.id, userId: this.state.userId};
    let response = await postData(`like/create`, data);
  };

  componentDidMount = async () => {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      this.setState({searchOpacity: 1});
    });
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({searchOpacity: 0});
    });
    let userId = await this.loadUsers();
    await this.setState({userId, loading: false});
    this.socket = this.props.screenProps.socketRef;
    this.socket.on(
      'on-call-request',
      async function(data) {
        await this.setState({modal: true, targetSocketId: data.socket, caller_info: data.info});
      }.bind(this),
    );
  };

  acceptCall = () => {
    this.socket.emit('acknowledge-call', {
      to: this.state.targetSocketId,
      code: 'accepted',
    });
    this.setState({modal: false, targetSocketId: -1, caller_info: {}});
    this.props.navigation.navigate('VideoChat');
  };

  rejectCall = () => {
    this.socket.emit('acknowledge-call', {
      to: this.state.targetSocketId,
      code: 'rejected',
    });
    this.setState({modal: false, targetSocketId: -1});
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
        {this.state.users.map((item, index) => {
          return (
            <DeckCard
              makeLike={this.makeLike}
              index={index}
              profile={item}
              userId={this.state.userId}
              stackRef={this.props.screenProps.stackRef}
              me_id={this.state.me.id}
            />
          );
        })}
      </CardStack>
    );
  };

  searchFilter = text => {
    let filteredUsers = this.state.users.filter(item => item.username.toLowerCase().includes(text.toLowerCase()));
    this.setState({filteredUsers: filteredUsers});
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    return (
      <Container>
        <Modal animationType="slide" transparent={false} visible={this.state.modal}>
          <Container style={{backgroundColor: 'white'}}>
            <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
              <ImageLoad
                source={{uri: `${baseurl}/user_images/${this.state.caller_info.profile_pic}`}}
                style={{width: 200, height: 200, borderRadius: 100}}
              />
              <Text style={{fontSize: 40}}>{this.state.caller_info.username}</Text>
              <Text style={{fontSize: 20}}>Is Calling You ...</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  backgroundColor: 'green',
                  borderRadius: 50,
                }}
                onPress={() => {
                  this.acceptCall();
                }}>
                <Icon name={'md-checkmark'} size={60} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  backgroundColor: 'red',
                  borderRadius: 50,
                }}
                onPress={() => {
                  this.rejectCall();
                }}>
                <Icon name={'md-close'} size={60} color="white" />
              </TouchableOpacity>
            </View>
          </Container>
        </Modal>

        <Header style={{height: SCREEN_HEIGHT * 0.08}} searchBar rounded>
          <Body>
            <Item style={{backgroundColor: 'white', width: '175%', height: '75%'}}>
              <Input placeholder="Search People ...." onChangeText={text => this.searchFilter(text)} />
              <Icon_ name="search" style={{color: 'black'}} />
            </Item>
          </Body>

          <Right>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
              <Thumbnail
                small
                defaultSource={require('../../images/profile.png')}
                source={{uri: `${baseurl}/user_images/${this.state.me.profile_pic}`}}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <View
          style={{
            opacity: this.state.searchOpacity,
            position: 'absolute',
            top: '10.5%',
            left: '3.3%',
            zIndex: 10,
            backgroundColor: 'white',
            height: this.state.searchOpacity === 1 ? '70%' : '0%',
            width: '82.7%',
          }}>
          {this.state.filteredUsers.length === 0 ? (
            <Text style={{margin: 10, color: 'black'}}>No Users With This Username...</Text>
          ) : null}

          <FlatList
            data={this.state.filteredUsers}
            renderItem={({item}) => {
              return (
                <ListItem
                  onPress={() => this.props.screenProps.stackRef.navigate('ViewProfile', {userId: item.id})}
                  avatar>
                  <Left>
                    <Thumbnail source={{uri: `${baseurl}/user_images/${item.profile_pic}`}} />
                  </Left>
                  <Body>
                    <Text>{item.username}</Text>
                    <Text note>I am very cool person</Text>
                  </Body>
                </ListItem>
              );
            }}
            keyboardShouldPersistTaps="handled"
            keyExtractor={item => item.id}
            removeClippedSubviews={true}
            initialNumToRender={2}
            updateCellsBatchingPeriod={1}
            updateCellsBatchingPeriod={100}
            windowSize={4}
          />
        </View>
        <View style={{flex: 1, zIndex: -1}}>
          {this.state.loading ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Spinner color="white" />
            </View>
          ) : (
            <View style={{flex: 1}}>{this.renderUsers()}</View>
          )}
          <View
            style={{
              height: SCREEN_HEIGHT * 0.12,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
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
              onPress={async () => {
                let userId = await this.loadUsers();
                await this.setState({userId, loading: false});
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
