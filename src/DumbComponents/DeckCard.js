import React from 'react';
import {Card, Thumbnail, CardItem, Left, Body, Button, Icon as Icon_, Text} from 'native-base';
import {View, TouchableOpacity} from 'react-native';
import ImageSliderForDeck from './ImageSliderForDeck';
import {getData} from '../helpers/httpServices';

export default class DeckCard extends React.Component {
  state = {
    likes: [],
    loading: false,
    alreadyLiked: false,
  };

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

  makeLike = (index, profile_id) => {
    this.props.makeLike(index);
    this.loadLikes(profile_id);
  };

  determineIfAlreadyLiked = () => {
    let filteredLikes = this.state.likes.filter(item => item.userId === parseInt(this.props.userId));
    if (filteredLikes.length !== 0) {
      this.setState({alreadyLiked: true});
    }
  };

  render() {
    const {profile, stackRef, index} = this.props;

    return (
      <Card style={{backgroundColor: 'white'}}>
        <CardItem>
          <Left>
            <Thumbnail source={{uri: `${baseurl}/user_images/${profile.profile_pic}`}} />
            <Body>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{profile.username}</Text>
              <Text note>{profile.username}</Text>
            </Body>
          </Left>
        </CardItem>
        <ImageSliderForDeck userId={profile.id} />
        <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          {this.state.loading ? (
            <Text>Loading...</Text>
          ) : (
            <TouchableOpacity
              disabled={this.state.alreadyLiked}
              style={{marginLeft: '5%', flexDirection: 'row', justifyContent: 'center', alignItems: 'space-between'}}
              onPress={() => this.makeLike(index, profile.id)}>
              <Icon_ style={{color: this.state.alreadyLiked ? 'orange' : 'grey'}} active name="thumbs-up" />
              <Text style={{color: this.state.alreadyLiked ? 'orange' : 'grey'}}>
                {'  '}
                {this.state.likes.length} Likes
              </Text>
            </TouchableOpacity>
          )}
          <Button transparent onPress={() => stackRef.navigate('ViewProfile', {userId: profile.id})}>
            <Text style={{color: 'orange'}}>View Profile</Text>
            <Icon_ style={{color: 'orange'}} active name="arrow-forward" />
          </Button>
        </View>
      </Card>
    );
  }
}
