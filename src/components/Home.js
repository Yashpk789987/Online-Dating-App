import React from 'react';

import {TouchableOpacity, Image} from 'react-native';
import {Text, Container, Header, Left, Body, Right, Row, Col, Card, CardItem, Content, Button, Icon} from 'native-base';

function Home(props) {
  return (
    <Container>
      <Header>
        <Left style={{paddingLeft: '5%'}}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Home</Text>
        </Left>
        <Body></Body>
        <Right>
          <Button transparent>
            <Icon name="search" />
          </Button>
          <Button transparent>
            <Icon name="person" />
          </Button>
          <Button transparent>
            <Icon name="more" />
          </Button>
        </Right>
      </Header>
      <Content>
        <Row>
          <TouchableOpacity style={{flex: 1, padding: '1%'}} onPress={() => props.navigation.navigate('Deck')}>
            <Col>
              <Card style={{flex: 0}}>
                <CardItem>
                  <Body style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15}} adjustsFontSizeToFit={true}>
                      Near By Users
                    </Text>
                  </Body>
                </CardItem>
                <CardItem cardBody>
                  <Image style={{width: '99.8%'}} source={require('../../images/near.png')} />
                </CardItem>
              </Card>
            </Col>
          </TouchableOpacity>

          <TouchableOpacity style={{flex: 1, padding: '1%'}} onPress={() => props.navigation.navigate('Chat')}>
            <Col>
              <Card style={{flex: 0}}>
                <CardItem>
                  <Body style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15}} adjustsFontSizeToFit={true}>
                      Message Chat
                    </Text>
                  </Body>
                </CardItem>
                <CardItem cardBody>
                  <Image source={require('../../images/chat.png')} />
                </CardItem>
              </Card>
            </Col>
          </TouchableOpacity>
        </Row>
        <Row>
          <TouchableOpacity style={{flex: 1, padding: '1%'}} onPress={() => props.navigation.navigate('Game')}>
            <Col>
              <Card style={{flex: 0}}>
                <CardItem>
                  <Body style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15}} adjustsFontSizeToFit={true}>
                      Play Roulette
                    </Text>
                  </Body>
                </CardItem>
                <CardItem cardBody>
                  <Image source={require('../../images/casino.png')} />
                </CardItem>
              </Card>
            </Col>
          </TouchableOpacity>

          <TouchableOpacity style={{flex: 1, padding: '1%'}} onPress={() => props.navigation.navigate('VideoChat')}>
            <Col>
              <Card style={{flex: 0}}>
                <CardItem>
                  <Body style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15}} adjustsFontSizeToFit={true}>
                      Live Video Chat
                    </Text>
                  </Body>
                </CardItem>
                <CardItem cardBody>
                  <Image source={require('../../images/camera.png')} />
                </CardItem>
              </Card>
            </Col>
          </TouchableOpacity>
        </Row>
        <Row>
          <TouchableOpacity style={{flex: 1, padding: '1%'}} onPress={() => props.navigation.navigate('Game')}>
            <Col>
              <Card style={{flex: 0}}>
                <CardItem>
                  <Body style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15}} adjustsFontSizeToFit={true}>
                      Nearby Locations
                    </Text>
                  </Body>
                </CardItem>
                <CardItem cardBody>
                  <Image source={require('../../images/cocktail.png')} />
                </CardItem>
              </Card>
            </Col>
          </TouchableOpacity>

          <Col></Col>
        </Row>
      </Content>
    </Container>
  );
}

export default Home;
