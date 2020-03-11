import React, {useState, useEffect} from 'react';
import {Card, Thumbnail, CardItem, Left, Body, Button, Icon as Icon_, Text} from 'native-base';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import ImageSliderForDeck from './ImageSliderForDeck';
import {getData} from '../helpers/httpServices';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class DeckCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: [],
      loading: false,
      alreadyLiked: false,
    };
  }

  componentDidMount() {
    this.setState({loading: true});
    this.loadLikes(this.props.profile.id);
  }

  loadLikes = async profile_id => {
    let result = await getData(`like/find-by-profileId/${profile_id}`);
    if (result.ok) {
      this.setState({likes: result.likes, loading: false});
    }
    this.determineIfAlreadyLiked();
  };

  determineIfAlreadyLiked = () => {
    let filteredLikes = this.state.likes.filter(item => item.userId === parseInt(this.props.userId));
    if (filteredLikes.length !== 0) {
      this.setState({alreadyLiked: true});
    }
  };

  render() {
    const {profile} = this.props;
    const {loading, likes, alreadyLiked} = this.state;
    return (
      <Card style={{backgroundColor: 'white'}}>
        <CardItem>
          <Left>
            <Thumbnail
              defaultSource={require('../../images/profile.png')}
              source={{uri: `${baseurl}/user_images/${profile.profile_pic}`}}
            />
            <Body>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{profile.username}</Text>
              <Text note>{profile.username}</Text>
            </Body>
          </Left>
        </CardItem>
        <ImageSliderForDeck userId={profile.id} />
        <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <TouchableOpacity
              disabled={alreadyLiked}
              style={{marginLeft: '5%', flexDirection: 'row', justifyContent: 'center', alignItems: 'space-between'}}
              onPress={() => this.makeLike(index, profile.id)}>
              <Icon_ style={{color: alreadyLiked ? 'orange' : 'grey'}} active name="thumbs-up" />
              <Text style={{color: alreadyLiked ? 'orange' : 'grey'}}>
                {'  '}
                {likes.length} Likes
              </Text>
            </TouchableOpacity>
          )}
          <Button
            transparent
            onPress={() => this.props.stackRef.navigate('ViewProfile', {userId: profile.id, me_id: this.props.me_id})}>
            <Text style={{color: 'orange'}}>View Profile</Text>
            <Icon_ style={{color: 'orange'}} active name="arrow-forward" />
          </Button>
        </View>
      </Card>
    );
  }
}
