import React from 'react';
import {Text, Image, TouchableOpacity, Dimensions, View, ProgressBarAndroid, FlatList} from 'react-native';
import {getFromCache} from '../../helpers/cacheTools';
import decode from 'jwt-decode';
import moment from 'moment';
import {getDataFromToken} from '../../helpers/tokenutils';
import {getAddressFromLatAndLong} from '../../helpers/locationutils';
import {openImagePicker} from '../../helpers/imageutils';
import {uploadImage, getData} from '../../helpers/httpServices';
import baseurl from '../../helpers/baseurl';
import ImageLoad from 'react-native-image-placeholder';
import ImageResizer from 'react-native-image-resizer';

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
    likes: 'Loading...',
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

  uploadProfileProgress = e => {
    this.setState({upload_fraction: parseFloat(e.loaded / e.total)});
  };

  uploadPicProgress = e => {
    this.setState({upload_fraction_pic: parseFloat(e.loaded / e.total)});
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

  openImagePicker = async is_profile => {
    try {
      let res = await openImagePicker(is_profile ? 'Select Profile Pic' : 'Select Pic', 'images');
      this.setState(state => ({profile_pic_uri: '', loading: true}));
      let compressResponse = await ImageResizer.createResizedImage(res.uri, 250, 600, 'JPEG', 100);

      let result = await uploadImage(
        'user/upload-image',
        {pic: {uri: compressResponse.uri, type: 'image/jpeg'}, is_profile: is_profile},
        is_profile ? this.uploadProfileProgress : this.uploadPicProgress,
      );

      if (result.ok) {
        this.setState({profile_pic_uri: `${baseurl}/user_images/${result.photo.name}`, loading: false});
        this.loadImages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  loadLikes = async profile_id => {
    let result = await getData(`like/find-by-profileId/${profile_id}`);
    if (result.ok) {
      this.setState({likes: result.likes.length, loading: false});
    }
  };

  componentDidMount = async () => {
    this.setState({loading: true});
    const result = await getDataFromToken();
    const {ok, data} = result;
    if (ok) {
      await this.setState({username: data.username, userId: data.id, loading: false});
      this.getAndSetAge(data);
      this.getAndSetAddress(data);
      this.loadLikes(data.id);
      this.loadImages();
    } else {
      ///// Move To Home
      this.props.screenProps.authRef.navigate('AuthLoading');
    }
  };
  render() {
    const height = Dimensions.get('screen').height;
    const width = Dimensions.get('screen').width;
    const {age, username, address, profile_pic_uri, likes, totalLikes} = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity onPress={() => this.props.screenProps.tabsRef.goBack()}>
              <Icon name="arrow-back" style={{color: 'white'}} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={{color: 'white', fontSize: 20, width: '120%', fontWeight: 'bold'}}>{username}</Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
              <Icon name="menu" style={{color: 'white'}} />
            </TouchableOpacity>
          </Right>
        </Header>

        {this.state.upload_fraction_pic === 0 || this.state.upload_fraction_pic === 1 ? null : (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              style={{width: '80%'}}
              indeterminate={false}
              color="white"
              progress={this.state.upload_fraction_pic}
            />
            <Text style={{color: 'white'}}>Uploading {`${parseInt(this.state.upload_fraction_pic * 100)} %`} </Text>
          </View>
        )}

        <Content>
          <Card
            style={{
              height: this.state.upload_fraction > 0 && this.state.upload_fraction < 1 ? height * 0.55 : height * 0.5,
            }}>
            <TouchableOpacity onPress={() => this.openImagePicker(true)}>
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
            </TouchableOpacity>
            {this.state.upload_fraction === 0 || this.state.upload_fraction === 1 ? null : (
              <>
                <ProgressBarAndroid
                  styleAttr="Horizontal"
                  style={{marginLeft: '10%', marginRight: '10%'}}
                  indeterminate={false}
                  color="#2196F3"
                  progress={this.state.upload_fraction}
                />
                <Text style={{marginLeft: '40%', marginRight: '10%'}}>
                  Uploading {`${parseInt(this.state.upload_fraction * 100)} %`}{' '}
                </Text>
              </>
            )}
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
                <Text style={{color: 'black', fontSize: 22, fontWeight: 'bold'}}>
                  {/* {likes === 'Loading...' ? 'Loading...' : this.findPopularity(likes, totalLikes)} */}
                  {'Medium'}
                </Text>
                <Text note>Popularity</Text>
              </View>
              <View
                style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                onPress={() => alert('Like Pressed')}>
                <Icon name="eye" style={{color: 'blue', fontSize: 30}} />
                <Text style={{color: 'black', fontSize: 22, fontWeight: 'bold'}}>{10}</Text>
                <Text note>Views </Text>
              </View>
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="thumbs-up" style={{color: 'orange'}} />
                <Text style={{color: 'black', fontSize: 22, fontWeight: 'bold'}}>{this.state.likes}</Text>
                <Text note>Likes</Text>
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
              <TouchableOpacity onPress={() => this.openImagePicker(false)}>
                <View
                  style={[
                    {width: width / 3},
                    {height: width / 3},
                    {marginBottom: 0, marginTop: 4},
                    {
                      borderStyle: 'dashed',
                      borderWidth: 3,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    {paddingLeft: '1%'},
                  ]}>
                  <Icon style={{fontSize: 80}} name="add" />
                  {this.state.upload_fraction_pic === 0 || this.state.upload_fraction_pic === 1 ? null : (
                    <ProgressBarAndroid
                      styleAttr="Horizontal"
                      style={{width: '100%'}}
                      indeterminate={false}
                      color="orange"
                      progress={this.state.upload_fraction_pic}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
