import React from 'react';
import {Text, Image, TouchableOpacity, Dimensions, View} from 'react-native';

import {
  Container,
  Header,
  Body,
  Left,
  Item,
  Content,
  CardItem,
  Right,
  Thumbnail,
  Input,
  Icon,
  Card,
  Button,
} from 'native-base';

var images = [
  require('../../images/g2.jpg'),
  require('../../images/g3.jpg'),
  require('../../images/g4.jpg'),
  require('../../images/g5.jpg'),
  require('../../images/g6.jpg'),
  require('../../images/g7.jpg'),
  require('../../images/g8.jpg'),
  require('../../images/g9.jpg'),
  require('../../images/g5.jpg'),
  require('../../images/g6.jpg'),
  require('../../images/g7.jpg'),
];

export default class Profile extends React.Component {
  state = {
    activeIndex: 1,
  };
  render() {
    const height = Dimensions.get('screen').height;
    const width = Dimensions.get('screen').width;
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{color: 'white'}} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={{color: 'white', fontSize: 20, width: '120%', fontWeight: 'bold'}}>Shinel_Jhones26</Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => alert('Menu Opened')}>
              <Icon name="menu" style={{color: 'white'}} />
            </TouchableOpacity>
          </Right>
        </Header>
        <Content>
          <Card style={{height: height * 0.5}}>
            <CardItem
              cardBody
              style={{
                height: height * 0.27,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{height: height * 0.25, width: '60%', borderRadius: 20}}
                source={require('../../images/g5.jpg')}
              />
            </CardItem>
            <CardItem
              style={{
                height: height * 0.06,
                flexDirection: 'column',
                paddingTop: '4%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black', fontSize: 22, fontWeight: 'bold'}}>Shinel Jhones, 26</Text>
              <Text note>San Francisco</Text>
            </CardItem>
            <View
              style={{
                paddingTop: '10%',
                height: height * 0.14,
                flexDirection: 'row',
                alignItems: 'space-between',
                justifyContent: 'space-around',
              }}>
              <View
                style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                onPress={() => alert('Like Pressed')}>
                <Icon name="heart" style={{color: 'red', fontSize: 30}} />
                <Text style={{paddingTop: '3%', color: 'black', fontSize: 22, fontWeight: 'bold'}}>Medium</Text>
                <Text note>Popularity</Text>
              </View>
              <View
                style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                onPress={() => alert('Like Pressed')}>
                <Icon name="flash" style={{color: 'blue', fontSize: 30}} />
                <Text style={{paddingTop: '3%', color: 'black', fontSize: 22, fontWeight: 'bold'}}>On</Text>
                <Text note>Super Power</Text>
              </View>
              <View
                style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                onPress={() => alert('Like Pressed')}>
                <Icon name="add-circle" style={{color: 'orange', fontSize: 30}} />
                <Text style={{paddingTop: '3%', color: 'black', fontSize: 22, fontWeight: 'bold'}}>750</Text>
                <Text note>Super Power</Text>
              </View>
            </View>
          </Card>
          <View style={{backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Button
                onPress={() => this.setState({activeIndex: 1})}
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  borderBottomWidth: this.state.activeIndex === 1 ? 5 : 0,
                }}
                transparent>
                <Text style={{color: this.state.activeIndex === 1 ? 'orange' : 'black', fontSize: 20}}>Photos</Text>
              </Button>
              <Button
                onPress={() => this.setState({activeIndex: 2})}
                style={{
                  width: '50%',
                  justifyContent: 'center',
                  borderBottomWidth: this.state.activeIndex === 2 ? 5 : 0,
                }}
                transparent>
                <Text style={{color: this.state.activeIndex === 2 ? 'orange' : 'black', fontSize: 20}}>Highlights</Text>
              </Button>
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white'}}>
              {images.map((image, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      {width: width / 3},
                      {height: width / 3},
                      {marginBottom: 0, marginTop: 4},
                      index % 3 !== 0 ? {paddingLeft: 4} : {paddingLeft: 3},
                    ]}>
                    <Image
                      style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        width: undefined,
                        height: undefined,
                      }}
                      source={image}></Image>
                  </View>
                );
              })}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
