import React from 'react';
import {View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';

import {Header, Left, Body, Right, Text, Button, Icon as Icon_} from 'native-base';

export default class Chat2 extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 2,
          text: 'I am Harry. You Have Followed Me ..',
          createdAt: new Date(),
          quickReplies: {
            type: 'checkbox',
            values: [
              {
                title: 'Yes',
                value: 'yes',
              },
              {
                title: 'Yes, let me show you with a picture!',
                value: 'yes_picture',
              },
              {
                title: 'Nope. What?',
                value: 'no',
              },
            ],
          },
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
        {
          _id: 1,
          text: 'Hello How Are You Genny ??',
          createdAt: new Date(),
          quickReplies: {
            type: 'radio',
            keepIt: true,
            values: [
              {
                title: '😋 Yes',
                value: 'yes',
              },
              {
                title: '😞 Nope. What?',
                value: 'no',
              },
            ],
          },
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    message = {...messages[0], user: {_id: 2}};

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <Header>
          <Left>
            <Text style={{color: 'white', fontWeight: 'bold', paddingLeft: '8%'}}>Harry </Text>
          </Left>
          <Body></Body>
          <Right>
            <Button transparent>
              <Icon_ name="search" />
            </Button>
          </Right>
        </Header>
        <GiftedChat
          renderSystemMessage={props => {
            console.log();
            return <Text>Hello</Text>;
          }}
          isTyping={true}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}
