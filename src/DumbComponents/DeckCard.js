import React, {useState, useEffect} from 'react';
import {Card, Thumbnail, CardItem, Left, Body, Button, Icon as Icon_, Text} from 'native-base';
import {View, TouchableOpacity} from 'react-native';
import ImageSliderForDeck from './ImageSliderForDeck';
import {getData} from '../helpers/httpServices';

export default DeckCard = ({profile, stackRef, index, makeLike}) => {
  let [likes, setLikes] = useState([]);
  let [loading, setLoading] = useState(false);
  let [alreadyLiked, setAlreadyLiked] = useState(false);

  loadLikes = async profile_id => {
    let result = await getData(`like/find-by-profileId/${profile_id}`);
    if (result.ok) {
      setLikes(result.likes);
      setLoading(false);
    }
    determineIfAlreadyLiked();
  };

  useEffect(() => {
    setLoading(true);
    loadLikes(profile.id);
  }, [profile]);

  makeLike = (index, profile_id) => {
    makeLike(index);
    loadLikes(profile_id);
  };

  determineIfAlreadyLiked = () => {
    let filteredLikes = likes.filter(item => item.userId === parseInt(this.props.userId));
    if (filteredLikes.length !== 0) {
      setAlreadyLiked(true);
    }
  };
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
        <Button transparent onPress={() => stackRef.navigate('ViewProfile', {userId: profile.id})}>
          <Text style={{color: 'orange'}}>View Profile</Text>
          <Icon_ style={{color: 'orange'}} active name="arrow-forward" />
        </Button>
      </View>
    </Card>
  );
};
