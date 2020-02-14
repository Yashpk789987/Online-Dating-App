import React from 'react';
import {Text, Icon, Container, Header, Spinner, Body, Left, Right} from 'native-base';
import {Image, ScrollView, Dimensions} from 'react-native';
var {width} = Dimensions.get('window');
export default class PlaceDetail extends React.Component {
  state = {
    loading: false,
    place: {},
    photos: [],
  };
  componentDidMount = async () => {
    this.setState({loading: true});
    let place_id = this.props.navigation.getParam('place_id');
    let res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=photo&key=AIzaSyBRYqiA-p-B_zdWU5N4ac7DgEDWFWmZFlM`,
    );
    let data = await res.json();
    await this.setState({loading: false, place: data.result, photos: data.result.photos});
  };
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Icon style={{color: 'white'}} onPress={() => this.props.navigation.goBack()} name="arrow-round-back" />
          </Left>
          <Body>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>Place Details</Text>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView horizontal={!this.state.loading}>
          {this.state.loading ? (
            <Spinner color="white" />
          ) : this.state.photos !== undefined ? (
            this.state.photos.map((item, index) => {
              return (
                <Image
                  style={{width: width, height: 250}}
                  resizeMode="cover"
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=AIzaSyBRYqiA-p-B_zdWU5N4ac7DgEDWFWmZFlM`,
                  }}
                />
              );
            })
          ) : null}
        </ScrollView>
      </Container>
    );
  }
}
