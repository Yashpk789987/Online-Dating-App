import React from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import EmojiInput from 'react-native-emoji-input';
import {Icon, Input, Item} from 'native-base';
import {Header, Left, Body, Right, Text, Button, Icon as Icon_, Container} from 'native-base';
import {Picker} from 'emoji-mart-native';
import searchGifs from '../helpers/searchGifs';
import GiphySearch from '../components/GiphySearch';

export default class ChatInterface extends React.Component {
  state = {
    name: '',
    user_id: -1,
    messages: [],
    emoji: '',
    text: '',
    gif_modal: false,
    emoji_modal: false,
    query: '',
    gif_url: '',
    search_results: [],
    text: '',
    user: {},
  };

  componentDidMount = async () => {
    const user = this.props.navigation.getParam('user');
    const {user_id, username} = user;

    this.socket = this.props.navigation.getParam('socketRef');
    this.setState({name: username, user_id: user_id, user});

    await this.setState({query: 'Trending Gifs'});
    this.searchGifs();
    let thisRef = this;
    this.socket.on('receive-message', function(data) {
      const {message} = data;
      thisRef.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, {
          ...message,
          user: {
            _id: message.user._id,
            name: username,
          },
        }),
      }));
    });
  };

  closeGifModal = gif_url => {
    this.setState({
      gif_modal: false,
      gif_url,
    });
    this.sendGif(gif_url);
  };

  searchGifs = async () => {
    const {query} = this.state;
    const search_results = await searchGifs(query);
    this.setState({
      search_results,
    });
  };

  sendGif = async url => {
    let message = {
      _id: 1,
      text: '',
      createdAt: new Date(),
      image: url,
      user: {
        _id: new Date().valueOf(),
      },
    };

    this.sendToSocket(message);

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, message),
    }));
  };

  sendToSocket = message => {
    const data = {message: message, user: this.state.user};
    this.socket.emit('send-chat-message', data);
  };

  onSend(messages = []) {
    let message = {...messages[0], user: {_id: new Date().valueOf()}};
    this.sendToSocket(message);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderInput = () => {
    return (
      <>
        <TouchableOpacity
          style={{margin: 10, borderWidth: 2, borderRadius: 2, padding: 2, borderColor: 'grey'}}
          onPress={() => this.setState({gif_modal: true})}>
          <Text style={{fontSize: 12}}>GIF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{margin: 10}}
          onPress={() => this.setState(previousState => ({emoji_modal: !previousState.emoji_modal}))}>
          <Icon style={{color: 'grey', size: 10}} active name={this.state.emoji_modal ? 'keypad' : 'happy'} />
        </TouchableOpacity>
      </>
    );
  };

  render() {
    const {name} = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <Icon style={{color: 'white'}} onPress={() => this.props.navigation.goBack()} name="arrow-round-back" />
          </Left>
          <Body>
            <Text style={{color: 'white', fontSize: 20}}>{name}</Text>
          </Body>

          <Right></Right>
        </Header>
        <GiftedChat
          text={this.state.text}
          messages={this.state.messages}
          onInputTextChanged={text => this.setState({text})}
          onSend={messages => this.onSend(messages)}
          renderActions={this.renderInput}
          user={{
            _id: 1,
          }}
        />

        {this.state.emoji_modal ? (
          <Container style={{flex: 1}}>
            <EmojiInput
              onEmojiSelected={emoji => {
                this.setState(previousState => ({text: previousState.text + '  ' + emoji.char}));
              }}
            />
          </Container>
        ) : (
          <></>
        )}

        <Modal style={{height: 300}} coverScreen={false} isVisible={this.state.gif_modal}>
          <View style={styles.modal_body}>
            <TouchableOpacity
              onPress={() => {
                this.setState({gif_modal: false});
              }}>
              <View style={styles.modal_close_container}>
                <Text style={styles.modal_close_text}>Close</Text>
              </View>
            </TouchableOpacity>

            <GiphySearch
              query={this.state.query}
              onSearch={query => this.setState({query})}
              search={this.searchGifs}
              search_results={this.state.search_results}
              onPick={gif_url => this.closeGifModal(gif_url)}
            />
          </View>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  custom_actions_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    padding: 10,
  },
  modal_body: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
  modal_close_container: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },
  modal_close_text: {
    color: '#0366d6',
  },
});
