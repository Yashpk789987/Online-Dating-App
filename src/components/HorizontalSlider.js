import React from 'react-native';
import {ScrollView, Image, StyleSheet, Dimensions} from 'react-native';
import {Card} from 'native-base';

export default function HorizontalSlider(props) {
  return (
    <ScrollView horizontal={true} style={styles.scrollview}>
      <Card style={styles.card}>
        <Image resizeMode="cover" style={styles.image} source={require('../../images/g1.jpg')} />
      </Card>
      <Card style={styles.card}>
        <Image resizeMode="cover" style={styles.image} source={require('../../images/g2.jpg')} />
      </Card>
      <Card style={styles.card}>
        <Image resizeMode="cover" style={styles.image} source={require('../../images/g3.jpg')} />
      </Card>
      <Card style={styles.card}>
        <Image resizeMode="cover" style={styles.image} source={require('../../images/g4.jpg')} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('screen').width * 0.35,
    height: Dimensions.get('screen').width * 0.5,
    overflow: 'visible',
    borderRadius: 20,
  },
  card: {
    width: Dimensions.get('screen').width * 0.35,
    height: Dimensions.get('screen').width * 0.5,
    borderRadius: 20,
    marginLeft: 15,
  },
});
