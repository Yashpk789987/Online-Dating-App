import React from 'react';
import {
  Text,
  Spinner,
  List,
  Header,
  Left,
  Input,
  Thumbnail,
  Button,
  Container,
  Body,
  Item,
  Right,
  Icon,
  Content,
  ListItem,
  Radio,
} from 'native-base';
import {PermissionsAndroid, RefreshControl} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default class NearbyLocations extends React.Component {
  state = {
    allowed: false,
    loading: false,
    places: [],
    latitude: '',
    longitude: '',
    search: '',
    type: '',
  };

  askPermissions = async () => {
    let response = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    if (Object.values(response).some(item => item === 'denied')) {
      this.askPermissions();
    } else {
      this.setState({allowed: true});
      this.getCurrentLocation();
    }
  };

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(async info => {
      let {latitude, longitude} = info.coords;
      await this.setState({latitude: latitude, longitude: longitude});
      this.loadnearbyplaces();
    });
  };

  loadnearbyplaces = async () => {
    try {
      if (this.state.allowed) {
        this.setState({loading: true});
        let {latitude, longitude, search, type} = this.state;
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=${type}&keyword=${search}&key=AIzaSyBRYqiA-p-B_zdWU5N4ac7DgEDWFWmZFlM`;
        let res = await fetch(url);
        let data = await res.json();
        this.setState({places: data.results, loading: false});
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount = async () => {
    this.setState({loading: true, type: 'restaurant'});
    if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)) {
      this.setState({allowed: true});
      this.getCurrentLocation();
    } else {
      this.askPermissions();
    }
  };

  makeList = () => {
    return this.state.places.map((item, index) => {
      return (
        <ListItem thumbnail>
          <Left>
            <Thumbnail
              square
              source={{
                uri: item.icon,
              }}
            />
          </Left>
          <Body>
            <Text style={{color: 'white'}}>{item.name}</Text>
            <Text style={{color: 'white'}} note numberOfLines={2}>
              {item.vicinity}
            </Text>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.screenProps.stackRef.navigate('PlaceDetail', {place_id: item.place_id})}>
              <Text>View</Text>
            </Button>
          </Right>
        </ListItem>
      );
    });
  };
  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Body>
            <Item style={{backgroundColor: 'white', width: '100%', height: '75%'}} rounded>
              <Icon name="search" style={{color: 'black'}} />
              <Input
                onChangeText={async text => {
                  await this.setState({search: text});
                  this.loadnearbyplaces();
                }}
                placeholder="Search Nearby Bars , Restaurants .."
                rounded
              />
            </Item>
          </Body>
        </Header>
        <Container style={{flex: 0.05, flexDirection: 'row', justifyContent: 'space-around'}}>
          <>
            <Radio
              selected={this.state.type === 'restaurant'}
              onPress={async () => {
                await this.setState({type: 'restaurant'});
                this.loadnearbyplaces();
              }}
              color="orange"
              selectedColor="#82CAF6"
            />
            <Text style={{color: 'white'}}>Restaurants</Text>
          </>
          <>
            <Radio
              selected={this.state.type === 'liquor_store'}
              onPress={async () => {
                await this.setState({type: 'liquor_store'});
                this.loadnearbyplaces();
              }}
              color="orange"
              selectedColor="#82CAF6"
            />
            <Text style={{color: 'white'}}>Bars</Text>
          </>
          <>
            <Radio
              selected={this.state.type === 'night_club'}
              onPress={async () => {
                await this.setState({type: 'night_club'});
                this.loadnearbyplaces();
              }}
              color="orange"
              selectedColor="#82CAF6"
            />
            <Text style={{color: 'white'}}>Night Clubs</Text>
          </>
        </Container>
        {this.state.loading ? (
          <Spinner color="white" />
        ) : (
          <Content
            refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={this.loadnearbyplaces} />}>
            <List>{this.makeList()}</List>
          </Content>
        )}
      </Container>
    );
  }
}
