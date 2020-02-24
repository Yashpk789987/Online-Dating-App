import React, {useEffect, useState} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import {
  Left,
  Body,
  Right,
  Button,
  Icon as Icon_,
  Container,
  Item,
  Input,
  Thumbnail,
  Spinner,
  DeckSwiper,
  Card,
  CardItem,
  cardBody,
} from 'native-base';
import {getData} from '../helpers/httpServices';

let SCREEN_HEIGHT = Dimensions.get('window').height;
SCREEN_HEIGHT = SCREEN_HEIGHT - SCREEN_HEIGHT * 0.45;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ImageSliderForDeck extends React.Component {
  state = {
    loading: false,
    images: [],
  };
  componentDidMount = async () => {
    this.setState({loading: true});
    let response = await getData(`user/photos/${this.props.userId}`);
    if (response.ok) {
      this.setState({loading: false, images: response.photos});
    }
  };
  render() {
    if (this.state.loading) {
      return <Spinner color="orange" />;
    }
    return (
      <ScrollView horizontal={true}>
        {this.state.images.map(item => {
          return (
            <ImageLoad
              resizeMode="cover"
              style={{height: SCREEN_HEIGHT, width: SCREEN_WIDTH}}
              source={{uri: `${baseurl}/user_images/${item.name}`}}
            />
          );
        })}
      </ScrollView>
    );
  }
}
