import React from 'react';
import {getData, postData} from '../../helpers/httpServices';
import {getDataFromToken} from '../../helpers/tokenutils';
import {FlatList, View, TouchableOpacity, RefreshControl, Keyboard} from 'react-native';
import {Header, Item, Input, Container, Icon, Text, Spinner, ListItem, Left, Body, Thumbnail, Right} from 'native-base';
import baseurl from '../../helpers/baseurl';

export default class Invites extends React.Component {
  state = {
    user_id: -1,
    loading: false,
    likes: [],
    searching: false,
    filteredLikes: [],
  };

  componentDidMount = async () => {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.setState(state => ({searching: false, filteredLikes: state.likes}));
    });
    this.setState({loading: true});
    let result = await getDataFromToken();
    if (result.ok) {
      await this.setState({loading: false, user_id: result.data.id});
      this.loadLikes();
    } else {
      alert('Session Expired. PLease Login again');
    }

    this.props.navigation.addListener('didFocus', () => {
      this.loadLikes();
    });
  };

  loadLikes = async () => {
    this.setState({loading: true});
    let result = await getData(`like/find-info-by-profileId/${this.state.user_id}`);
    if (result.ok) {
      this.setState({likes: result.likes, filteredLikes: result.likes, loading: false});
    }
  };

  likeBack = async (like_id, profile_id) => {
    let result = await postData(`like/update-like-status`, {
      id: like_id,
      like_back: true,
      user_id: this.state.user_id,
      profile_id: profile_id,
    });
    if (result.ok) {
      //this.props.navigation.navigate('Your Matches');
      this.loadLikes();
    } else {
      alert('technical error');
    }
  };

  dislikeBack = async like_id => {
    let result = await postData(`like/update-like-status`, {id: like_id, like_back: false, dislike_back: true});
    if (result.ok) {
      this.loadLikes();
    } else {
      alert('technical error');
    }
  };

  searchLikes = text => {
    let filteredLikes = this.state.likes.filter(item =>
      item.username.toLocaleLowerCase().includes(text.toLocaleLowerCase()),
    );
    this.setState({filteredLikes: filteredLikes});
  };

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  renderLikes = () => {
    return (
      <FlatList
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.loadLikes} />}
        data={this.state.filteredLikes}
        renderItem={({item}) => (
          <View style={{marginTop: '2%', marginRight: '2%', marginLeft: '-3%'}}>
            <ListItem
              onPress={() => this.props.screenProps.stackRef.navigate('ViewProfile', {userId: item.profile_id})}
              avatar
              style={{backgroundColor: 'white'}}>
              <Left>
                <Thumbnail
                  defaultSource={require('../../../images/profile.png')}
                  source={{uri: `${baseurl}/user_images/${item.profile_pic}`}}
                />
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
                onPress={() => this.likeBack(item.like_id, item.profile_id)}>
                <Icon style={{color: 'green'}} active name="thumbs-up" />
                <Text style={{color: 'green'}}>{'  '}Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'space-between',
                }}
                onPress={() => this.dislikeBack(item.like_id)}>
                <Icon style={{color: 'red'}} active name="thumbs-down" />
                <Text style={{color: 'red'}}>{'  '}Ignore </Text>
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
        <Header>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: 'white'}} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={{color: 'white', fontSize: 20, width: '120%', fontWeight: 'bold'}}>
              {this.props.screenProps.me.username}
            </Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
              <Icon name="menu" style={{color: 'white'}} />
            </TouchableOpacity>
          </Right>
        </Header>
        {this.state.searching ? (
          <Item
            style={{
              marginTop: '2%',
              marginRight: '2%',
              marginLeft: '2%',
              marginBottom: '4%',
              height: '11.0%',
              backgroundColor: 'white',
            }}
            rounded>
            <Icon
              onPress={() => {
                this.setState(state => ({filteredMatches: state.matches, searching: false}));
              }}
              name="arrow-back"
              style={{color: 'black', fontSize: 25}}
            />
            <Input
              ref={this.search}
              onBlur={() => this.setState(state => ({filteredLikes: state.likes, searching: false}))}
              autoFocus={true}
              onChangeText={text => this.searchLikes(text)}
              placeholder="Search"
              rounded
            />
          </Item>
        ) : (
          <View style={{flex: 0.2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text
              style={{
                marginTop: '4%',
                color: 'white',
                marginBottom: '5%',
                padding: '2%',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Your Invites
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({searching: true});
              }}>
              <Icon name="search" style={{paddingRight: '2%', color: 'white'}} />
            </TouchableOpacity>
          </View>
        )}

        {!this.state.loading && this.state.likes.length === 0 ? (
          <View style={{alignText: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>No Invites To Show...</Text>
          </View>
        ) : null}
        {this.state.loading ? <Spinner color="white" /> : this.renderLikes()}
      </Container>
    );
  }
}
