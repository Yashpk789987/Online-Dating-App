import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, StyleSheet, Text, TouchableOpacity, Keyboard} from 'react-native';

import {
  Content,
  List,
  ListItem,
  Body,
  Button,
  Header,
  Item,
  Container,
  Input,
  Left,
  Right,
  Thumbnail,
  Icon,
  Badge,
  Spinner,
} from 'native-base';

import {FlatList, RefreshControl} from 'react-native';

import {getData, postData} from '../../helpers/httpServices';
import {getDataFromToken} from '../../helpers/tokenutils';
import baseurl from '../../helpers/baseurl';

export default class Match extends React.Component {
  constructor(props) {
    super(props);
    this.search = React.createRef();
    this.state = {
      matches: [],
      loading: false,
      user_id: -1,
      sender: {},
      searching: false,
      filteredMatches: [],
    };
  }

  componentDidMount = async () => {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({searching: false});
    });
    this.setState({loading: true});

    let result = await getDataFromToken();
    if (result.ok) {
      await this.setState({loading: false, user_id: result.data.id, sender: result.data});
      await this.loadMatches();
    } else {
      alert('Session Expired. PLease Login again');
    }
    this.props.navigation.addListener('didFocus', async () => {
      await this.loadMatches();
    });
  };

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  loadMatches = async () => {
    this.setState({loading: true});
    let result = await getData(`like/load-matches-by-profileId/${this.state.user_id}`);
    if (result.ok) {
      await this.setState({matches: result.matches, filteredMatches: result.matches, loading: false});
    } else {
      alert('technical Error ');
    }
  };

  searchMatches = text => {
    let filteredMatches = this.state.matches.filter(item =>
      item.username.toLocaleLowerCase().includes(text.toLocaleLowerCase()),
    );
    this.setState({filteredMatches: filteredMatches});
  };

  renderMatches = () => {
    return (
      <FlatList
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.loadMatches} />}
        data={this.state.filteredMatches}
        renderItem={({item}) => {
          return (
            <ListItem onPress={() => this.openChat(item)} thumbnail>
              <Left>
                <Thumbnail source={{uri: `${baseurl}/user_images/${item.profile_pic}`}} />
              </Left>
              <Body style={{width: '50%', flex: 1, flexDirection: 'row'}}>
                <Text style={{color: 'white', fontSize: 16}}>{item.username + '  '}</Text>
                {item.socket_id === undefined ? null : (
                  <View style={{backgroundColor: 'green', width: 15, height: 15, borderRadius: 18 / 2}}></View>
                )}
              </Body>
              <Right>
                <TouchableOpacity onPress={() => this.openChat(item)}>
                  <Icon name="arrow-round-forward" />
                </TouchableOpacity>
              </Right>
            </ListItem>
          );
        }}
        keyExtractor={item => item.id}
      />
    );
  };

  openChat = item => {
    this.props.screenProps.stackRef.navigate('ChatInterface', {
      user: item,
      user_id: this.state.user_id,
      sender: this.state.sender,
      socketRef: this.props.screenProps.socketRef,
    });
  };

  render() {
    return (
      <Container>
        {this.state.searching ? (
          <Item
            style={{
              marginTop: '2%',
              marginRight: '2%',
              marginLeft: '2%',
              marginBottom: '4%',
              height: '10.0%',
              backgroundColor: 'white',
            }}
            rounded>
            <Icon
              onPress={() => {
                this.setState(state => ({filteredMatches: state.matches, searching: false}));
              }}
              name="arrow-back"
              style={{color: 'black', fontSize: 20}}
            />
            <Input
              ref={this.search}
              onBlur={() => this.setState(state => ({filteredMatches: state.matches, searching: false}))}
              autoFocus={true}
              onChangeText={text => this.searchMatches(text)}
              placeholder="Search"
              rounded
            />
          </Item>
        ) : (
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginTop: '4%',
                color: 'white',
                marginBottom: '5%',
                padding: '2%',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Your Matches
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({searching: true});
              }}>
              <Icon name="search" style={{paddingRight: '2%', color: 'white'}} />
            </TouchableOpacity>
          </View>
        )}
        {!this.state.loading && this.state.matches.length === 0 ? (
          <View style={{alignText: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>No Matches To Show...</Text>
          </View>
        ) : null}

        {this.state.loading ? <Spinner color="white" /> : this.renderMatches()}
      </Container>
    );
  }
}
