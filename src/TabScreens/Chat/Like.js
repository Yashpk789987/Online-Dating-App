import React from 'react';
import {getData, postData} from '../../helpers/httpServices';
import {getDataFromToken} from '../../helpers/tokenutils';
import {FlatList, View, TouchableOpacity, RefreshControl} from 'react-native';
import {Container, Icon, Text, Spinner, ListItem, Left, Body, Thumbnail, Right} from 'native-base';
import baseurl from '../../helpers/baseurl';

export default class Like extends React.Component {
  state = {
    user_id: -1,
    loading: false,
    likes: [],
  };

  componentDidMount = async () => {
    this.setState({loading: true});
    let result = await getDataFromToken();
    if (result.ok) {
      await this.setState({loading: false, user_id: result.data.id});
      this.loadLikes();
    } else {
      alert('Session Expired. PLease Login again');
    }
  };

  loadLikes = async () => {
    this.setState({loading: true});
    let result = await getData(`like/find-info-by-profileId/${this.state.user_id}`);
    if (result.ok) {
      this.setState({likes: result.likes, loading: false});
    }
  };

  likeBack = async like_id => {
    let result = await postData(`like/update-like-status`, {id: like_id, like_back: true});
    if (result.ok) {
      this.props.navigation.navigate('Your Matches');
    } else {
      alert('technical error');
    }
  };

  dislikeBack = async like_id => {
    let result = await postData(`like/update-like-status`, {id: like_id, dislike_back: true});
    if (result.ok) {
      this.loadLikes();
    } else {
      alert('technical error');
    }
  };

  renderLikes = () => {
    return (
      <FlatList
        refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.loadLikes} />}
        data={this.state.likes}
        renderItem={({item}) => (
          <View style={{marginRight: '2%', marginLeft: '-3%'}}>
            <ListItem avatar style={{backgroundColor: 'white'}}>
              <Left>
                <Thumbnail source={{uri: `${baseurl}/user_images/${item.profile_pic}`}} />
              </Left>
              <Body style={{width: '50%', flex: 1, flexDirection: 'row'}}>
                <Text style={{fontSize: 16}}>
                  {item.username + '  '}
                  {'\n\n'}
                  {'I am very cool person'}
                </Text>
              </Body>

              <Right></Right>
            </ListItem>
            <View
              style={{
                paddingTop: '1%',
                paddingBottom: '5%',
                marginLeft: '5%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: 'white',
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'space-between',
                }}
                onPress={() => this.likeBack(item.like_id)}>
                <Icon style={{color: 'green'}} active name="thumbs-up" />
                <Text style={{color: 'green'}}>{'  '}Like Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'space-between',
                }}
                onPress={() => this.dislikeBack(item.like_id)}>
                <Icon style={{color: 'red'}} active name="thumbs-down" />
                <Text style={{color: 'red'}}>{'  '}Dislike </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'space-between',
                }}
                onPress={() => this.props.screenProps.stackRef.navigate('ViewProfile', {userId: item.profile_id})}>
                <Icon style={{color: 'orange'}} active name="person" />
                <Text style={{color: 'orange'}}>{'  '}Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    );
  };

  render() {
    return (
      <Container>
        <Text style={{color: 'white', marginBottom: '5%', padding: '2%', fontSize: 20, fontWeight: 'bold'}}>
          Your Likes
        </Text>
        {this.state.loading ? <Spinner color="white" /> : this.renderLikes()}
      </Container>
    );
  }
}
