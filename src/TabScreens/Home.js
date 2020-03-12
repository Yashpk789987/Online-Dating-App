/// PRESENTLY THIS COMPONENT IS OF NO USE //////

import React from 'react';
import {ScrollView, Image, Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  Container,
  Card,
  Text,
  Content,
  Left,
  Right,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Body,
  Header,
  Item,
  Input,
} from 'native-base';

export default function Home(props) {
  return (
    <Container>
      <Header searchBar rounded>
        <Body>
          <Item style={{backgroundColor: 'white', width: '165%', height: '75%'}} rounded>
            <Icon name="search" style={{color: 'black'}} />
            <Input placeholder="Search" rounded />
          </Item>
        </Body>

        <Right>{/* <Thumbnail small source={require('../../images/g2.jpg')} /> */}</Right>
      </Header>
      <Content>
        <View style={styles.flex1}>
          <Text style={styles.findmatch}>Find Match</Text>
          <TouchableOpacity>
            <Text style={styles.viewall}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true}>
          {/* <Card style={styles.card}>
            <Image resizeMode="cover" style={styles.image} source={require('../../images/g8.jpg')} />
          </Card>
          <Card style={styles.card}>
            <Image resizeMode="cover" style={styles.image} source={require('../../images/g5.jpg')} />
          </Card>
          <Card style={styles.card}>
            <Image resizeMode="cover" style={styles.image} source={require('../../images/g6.jpg')} />
          </Card>
          <Card style={styles.card}>
            <Image resizeMode="cover" style={styles.image} source={require('../../images/g7.jpg')} />
          </Card> */}
        </ScrollView>
        <Content>
          <Card>
            {/* <CardItem>
              <Left>
                <Thumbnail source={require('../../images/g7.jpg')} />
                <Body>
                  <Text style={{color: 'black'}}>Shinel Jons</Text>
                  <Text note>3 hours ago</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={require('../../images/g5.jpg')} style={{height: 200, width: null, flex: 1}} />
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon style={{color: 'orange'}} active name="thumbs-up" />
                  <Text style={{color: 'orange'}}>12 Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent>
                  <Icon style={{color: 'orange'}} active name="chatbubbles" />
                  <Text style={{color: 'orange'}}>4 Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>3h ago</Text>
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={require('../../images/g6.jpg')} />
                <Body>
                  <Text style={{color: 'black'}}>Erica frozen</Text>
                  <Text note>7 hours ago</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={require('../../images/g6.jpg')} style={{height: 200, width: null, flex: 1}} />
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon active style={{color: 'orange'}} name="thumbs-up" />
                  <Text style={{color: 'orange'}}>15 Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent>
                  <Icon style={{color: 'orange'}} active name="chatbubbles" />
                  <Text style={{color: 'orange'}}>8 Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>7h ago</Text>
              </Right>
            </CardItem> */}
          </Card>
        </Content>
      </Content>
    </Container>
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
  flex1: {flex: 0.15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  findmatch: {color: 'white', fontSize: 30, paddingLeft: '5%', fontWeight: 'bold'},
  viewall: {color: 'orange', paddingRight: '2%'},
});
