import React from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import EmojiSelector from 'react-native-emoji-selector';
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
    // this.setState({
    //   messages: [
    //     {
    //       _id: '19ff1d4b-ae51-41f2-aa2d-d83b37a26606',
    //       createdAt: '2020-02-22T08:27:34.834Z',
    //       text: 'Bver',
    //       user: {_id: 1},
    //     },
    //     {
    //       _id: '27a42f98-6983-4d90-9b54-ad1ff8e39f57',
    //       createdAt: '2020-02-22T08:27:24.129Z',
    //       text: 'Egebrb',
    //       user: {_id: 1},
    //     },
    //     {
    //       _id: '9aae310c-0a69-4e33-976c-f3539ec52d8a',
    //       createdAt: '2020-02-22T08:27:14.537Z',
    //       text: 'Hii',
    //       user: {_id: '3', name: 'prashant2128'},
    //     },
    //     {
    //       _id: '92d62557-191f-4a72-b714-36c53f5bd1de',
    //       createdAt: '2020-02-22T08:27:23.520Z',
    //       text: '😁😁😁',
    //       user: {_id: '4', name: 'prashant2128'},
    //     },
    //     {
    //       _id: 'd0af1b75-ae05-45b9-914a-002f75c2856c',
    //       createdAt: '2020-02-22T08:27:34.873Z',
    //       text: 'Dgdgdh',
    //       user: {_id: '3', name: 'prashant2128'},
    //     },
    //     {
    //       _id: 'e30a26e7-bce2-433d-af8c-f4e3cce7f705',
    //       createdAt: '2020-02-22T08:27:41.157Z',
    //       text: 'Jcjc',
    //       user: {_id: '3', name: 'prashant2128'},
    //     },
    //   ],
    // });
    const user = this.props.navigation.getParam('user');
    const {user_id, username} = user;

    this.socket = this.props.navigation.getParam('socketRef');
    this.setState({name: username, user_id: user_id, user});

    await this.setState({query: 'Trending Gifs'});
    this.searchGifs();
    let thisRef = this;
    this.socket.on('receive-message', function(data) {
      const {message} = data;
      thisRef.setState(state => ({
        messages: [
          ...state.messages,
          {
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: {
              _id: message.user._id,
              name: username,
            },
          },
        ],
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
    let message = [
      {
        _id: 2,
        text: '',
        createdAt: new Date(),
        image: url,
        user: {
          _id: this.state.user_id,
        },
      },
    ];

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
    let message = {...messages[0], user: {_id: this.state.user_id}};
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
    console.log(this.state.messages);
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
          messages={this.state.messages.reverse()}
          onInputTextChanged={text => this.setState({text})}
          onSend={messages => this.onSend(messages)}
          renderActions={this.renderInput}
          user={{
            _id: 1,
          }}
        />

        {this.state.emoji_modal ? (
          <Container style={{flex: 1}}>
            <EmojiSelector
              showSearchBar={false}
              columns={8}
              onEmojiSelected={emoji => {
                this.setState(previousState => ({text: previousState.text + '  ' + emoji}));
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
