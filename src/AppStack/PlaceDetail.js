import React from 'react';
import {View} from 'react-native';
import {
  Text,
  Icon,
  Container,
  Header,
  Spinner,
  Body,
  Left,
  Right,
  Content,
  ListItem,
  List,
  Thumbnail,
} from 'native-base';
import {Rating} from 'react-native-ratings';
import ImageSlider from '../DumbComponents/ImageSlider';
import StarRating from 'react-native-star-rating';

export default class PlaceDetail extends React.Component {
  state = {
    loading: false,
    place: {},
    photos: [],
    reviews: [],
    address: '',
    rating: 0,
    name: '',
    opening_hours: '',
    periods: [],
    week_days: [],
  };

  componentDidMount = async () => {
    try {
      this.setState({loading: true});
      let place_id = this.props.navigation.getParam('place_id');
      let res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=photo,name,formatted_address,opening_hours,rating,reviews,geometry&key=AIzaSyBRYqiA-p-B_zdWU5N4ac7DgEDWFWmZFlM`,
      );
      let data = await res.json();
      await this.setState({
        loading: false,
        place: data.result,
        photos: data.result.photos,
        name: data.result.name,
        formatted_address: data.result.formatted_address,
        reviews: data.result.reviews,
        rating: data.result.rating,
      });
      if (data.result.opening_hours !== undefined) {
        await this.setState({
          periods: data.result.opening_hours.periods,
          week_days: data.result.opening_hours.weekday_text,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <Container>
          <Header>
            <Left>
              <Icon style={{color: 'white'}} onPress={() => this.props.navigation.goBack()} name="arrow-round-back" />
            </Left>
            <Body>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>Loading Place Details ...</Text>
            </Body>
            <Right></Right>
          </Header>
          <Spinner color="white" />
        </Container>
      );
    }
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
        <Content style={{padding: '2%'}}>
          <ImageSlider photos={this.state.photos} />
          <View style={{backgroundColor: 'white', marginTop: '2%'}}>
            <Body style={{paddingTop: '5%'}}>
              <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: '2%', paddingRight: '2%'}}>
                {this.state.name}
              </Text>
              <Text>{this.state.week_days[0]}</Text>
            </Body>
            <View
              style={{
                padding: '2%',
                flex: 0.1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <StarRating
                starSize={25}
                fullStarColor={'orange'}
                disabled={true}
                maxStars={5}
                rating={parseFloat(this.state.rating)}
              />
              <Text>{this.state.rating}</Text>
            </View>
            <List style={{marginTop: 20, marginBottom: 30}}>
              {this.state.reviews === undefined ? (
                <View style={{color: 'white', flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
                  <Text>No Reviews To Show ..</Text>
                </View>
              ) : (
                this.state.reviews.map((item, index) => {
                  return (
                    <ListItem avatar>
                      <Left>
                        <Thumbnail source={{uri: item.profile_photo_url}} />
                      </Left>
                      <Body>
                        <Text>{item.author_name}</Text>
                        <Text note>{item.text}</Text>
                        <Text note>{'   '}</Text>
                      </Body>
                      <Right>
                        <Text note>{item.relative_time_description}</Text>
                        <StarRating
                          starSize={15}
                          fullStarColor={'orange'}
                          disabled={true}
                          maxStars={5}
                          rating={item.rating}
                        />
                      </Right>
                    </ListItem>
                  );
                })
              )}
            </List>
          </View>
        </Content>
      </Container>
    );
  }
}
