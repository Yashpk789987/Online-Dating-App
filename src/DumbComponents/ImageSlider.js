import React, {useState} from 'react';
import {Image, Text, ScrollView, Dimensions, View} from 'react-native';
import {PlaceholderMedia, Placeholder, Shine} from 'rn-placeholder';
var {width} = Dimensions.get('window');

function ImageSlider({photos}) {
  let [loaded, setLoaded] = useState(false);
  if (photos === undefined) {
    return (
      <View style={{color: 'white', flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white'}}>No Photos To Show ..</Text>
      </View>
    );
  }
  return (
    <ScrollView indicatorStyle={{color: 'white'}} horizontal={true}>
      {photos.map((item, index) => {
        return (
          <>
            <Image
              onLoadEnd={() => setLoaded(true)}
              style={{width: width, height: 250}}
              resizeMode="cover"
              source={{
                uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=AIzaSyBRYqiA-p-B_zdWU5N4ac7DgEDWFWmZFlM`,
              }}
            />
          </>
        );
      })}
    </ScrollView>
  );
}

export default ImageSlider;
