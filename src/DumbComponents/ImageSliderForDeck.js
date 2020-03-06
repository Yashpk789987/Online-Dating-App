import React, {useEffect, useState} from 'react';
import {ScrollView, Dimensions, FlatList} from 'react-native';
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

export default ImageSliderForDeck = ({userId}) => {
  let [loading, setLoading] = useState(false);
  let [images, setImages] = useState([]);
  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      let response = await getData(`user/photos/${userId}`);
      if (response.ok) {
        setLoading(false);
        setImages(response.photos);
      }
    }
    loadImages();
  }, [userId]);

  if (loading) {
    return <Spinner color="orange" />;
  } else {
    return (
      <FlatList
        data={images}
        horizontal={true}
        renderItem={({item}) => {
          return (
            <ImageLoad
              resizeMode="cover"
              style={{height: SCREEN_HEIGHT, width: SCREEN_WIDTH}}
              source={{uri: `${baseurl}/user_images/${item.name}`}}
            />
          );
        }}
        keyExtractor={item => item.id}
        removeClippedSubviews={true}
        initialNumToRender={2}
        updateCellsBatchingPeriod={1}
        updateCellsBatchingPeriod={100}
        windowSize={4}
      />
    );
  }
};
