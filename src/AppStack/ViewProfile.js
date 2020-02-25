import React from 'react';
import {Text, Image, TouchableOpacity, Dimensions, View, ProgressBarAndroid, FlatList} from 'react-native';

import decode from 'jwt-decode';
import moment from 'moment';
import {getDataFromToken} from '../helpers/tokenutils';
import {getAddressFromLatAndLong} from '../helpers/locationutils';

import {uploadImage, getData} from '../helpers/httpServices';
import baseurl from '../helpers/baseurl';
import ImageLoad from 'react-native-image-placeholder';

import {
  Container,
  Header,
  Body,
  Left,
  Item,
  Content,
  CardItem,
  Right,
  Thumbnail,
  Input,
  Icon,
  Card,
  Button,
} from 'native-base';

export default class Profile extends React.Component {
  state = {
    activeIndex: 1,
    loading: false,
    userId: -1,
    username: 'Loading...',
    age: 'Loading...',
    address: 'Loading...',
    profile_pic_uri: '',
    profile_pic_uri_placeholder:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSfbXfGdccYWDfV83TGwNkVUv80gOfKsXQjnfAw3FYiVMD7X4kn',
    photos: [],
    upload_fraction: 0,
    upload_fraction_pic: 0,
  };

  getAndSetAge = userdata => {
    var years = moment().diff(userdata.dob, 'years', false);
    this.setState({age: years});
  };

  getAndSetAddress = async data => {
    const {
      location: {coordinates},
    } = data;
    let result = await getAddressFromLatAndLong({latitude: coordinates[0], longitude: coordinates[1]});
    if (result.ok) {
      this.setState({address: result.address});
    } else {
      ///// Handle Result.ok false
    }
  };

  loadImages = async () => {
    let result = await getData(`user/all-images/${this.state.userId}`);
    if (result.ok) {
      if (result.photos.length === 0) {
        this.setState(state => ({profile_pic_uri: state.profile_pic_uri_placeholder}));
      } else {
        this.setState({photos: result.photos});
        let photo = result.photos.filter(item => item.is_profile);
        this.setState({profile_pic_uri: `${baseurl}/user_images/${photo[0].name}`});
      }
    } else {
    }
  };

  componentDidMount = async () => {
    let userId = this.props.navigation.getParam('userId');
    this.setState({loading: true, userId});
    let result = await getData(`user/user-by-id/${userId}`);

    const {ok, user, photos} = result;
    if (ok) {
      await this.setState({
        username: user.username,
        loading: false,
        profile_pic_uri: `${baseurl}/user_images/${user.profile_pic}`,
        photos,
      });
      this.getAndSetAge(user);
      this.getAndSetAddress(user);
    } else {
      /// Handle Else
    }
  };
  render() {
    const height = Dimensions.get('screen').height;
    const width = Dimensions.get('screen').width;
    const {age, username, address, profile_pic_uri} = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: 'white'}} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={{color: 'white', fontSize: 20, width: '120%', fontWeight: 'bold'}}>{username}</Text>
          </Body>
          <Right></Right>
        </Header>

        <Content>
          <Card
            style={{
              height: this.state.upload_fraction > 0 && this.state.upload_fraction < 1 ? height * 0.55 : height * 0.5,
            }}>
            <CardItem
              cardBody
              style={{
                height: height * 0.27,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.profile_pic_uri === '' ? (
                <Text>Loading ....</Text>
              ) : (
                <ImageLoad
                  style={{height: height * 0.25, width: '60%', borderRadius: 20}}
                  source={{uri: profile_pic_uri}}
                />
              )}
            </CardItem>

            <CardItem
              style={{
                height: height * 0.06,
                flexDirection: 'column',
                paddingTop: '4%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black', fontSize: 22, fontWeight: 'bold'}}>
                {username}
                {' , '}
                {age}
              </Text>
              <Text note>{address}</Text>
            </CardItem>
            <View
              style={{
                paddingTop: '10%',
                height: height * 0.14,
                flexDirection: 'row',
                alignItems: 'space-between',
                justifyContent: 'space-around',
              }}>
              <View
                style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                onPress={() => alert('Like Pressed')}>
                <Icon name="heart" style={{color: 'red', fontSize: 30}} />
                <Text style={{paddingTop: '3%', color: 'black', fontSize: 22, fontWeight: 'bold'}}>Medium</Text>
                <Text note>Popularity</Text>
              </View>
              <View
                style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                onPress={() => alert('Like Pressed')}>
                <Icon name="flash" style={{color: 'blue', fontSize: 30}} />
                <Text style={{paddingTop: '3%', color: 'black', fontSize: 22, fontWeight: 'bold'}}>On</Text>
                <Text note>Super Power</Text>
              </View>
              <View
                style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                onPress={() => alert('Like Pressed')}>
                <Icon name="add-circle" style={{color: 'orange', fontSize: 30}} />
                <Text style={{paddingTop: '3%', color: 'black', fontSize: 22, fontWeight: 'bold'}}>750</Text>
                <Text note>Super Power</Text>
              </View>
            </View>
          </Card>
          <View style={{backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Button
                onPress={() => this.setState({activeIndex: 1})}
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  borderBottomWidth: this.state.activeIndex === 1 ? 5 : 0,
                }}
                transparent>
                <Text style={{color: this.state.activeIndex === 1 ? 'orange' : 'black', fontSize: 20}}>Photos</Text>
              </Button>
              <Button
                onPress={() => this.setState({activeIndex: 2})}
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  borderBottomWidth: this.state.activeIndex === 2 ? 5 : 0,
                }}
                transparent>
                <Text style={{color: this.state.activeIndex === 2 ? 'orange' : 'black', fontSize: 20}}>Highlights</Text>
              </Button>
            </View>

            <View style={{flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white'}}>
              {this.state.photos.map((image, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      {width: width / 3},
                      {height: width / 3},
                      {marginBottom: 0, marginTop: 4},
                      index % 3 !== 0 ? {paddingLeft: 4} : {paddingLeft: 3},
                    ]}>
                    <ImageLoad
                      style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        width: undefined,
                        height: undefined,
                      }}
                      source={{uri: `${baseurl}/user_images/${image.name}`}}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
