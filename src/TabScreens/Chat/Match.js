// import React, {useEffect, useState} from 'react';
// import InCallManager from 'react-native-incall-manager';
// import io from 'socket.io-client';
// import {View, SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import {
//   Content,
//   List,
//   ListItem,
//   Body,
//   Button,
//   Header,
//   Item,
//   Container,
//   Input,
//   Left,
//   Right,
//   Thumbnail,
//   Icon,
//   Badge,
// } from 'native-base';

// export default class Match extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       users: [],
//     };
//   }

//   openChat = item => {
//     this.props.screenProps.stackRef.navigate('ChatInterface', {
//       user: item,
//       socketRef: this.props.screenProps.socketRef,
//     });
//   };

//   render() {
//     return (
//       <Container>
//         <Content style={{height: '0%'}}>
//           <Text style={{color: 'white', padding: '2%', fontSize: 20, fontWeight: 'bold'}}>Your Matches</Text>
//           {this.props.screenProps.users.length === 0 ? (
//             <Text style={{marginLeft: '25%', color: 'white', fontSize: 20}}>No Users Online ...</Text>
//           ) : (
//             <List>
//               {this.props.screenProps.users.map((item, index) => {
//                 return (
//                   <ListItem thumbnail>
//                     <Left>
//                       <Thumbnail source={require('../../../images/g5.jpg')} />
//                     </Left>
//                     <Body style={{width: '50%', flex: 1, flexDirection: 'row'}}>
//                       <Text style={{color: 'white', fontSize: 16}}>{item.username + '  '}</Text>
//                       <View style={{backgroundColor: 'green', width: 15, height: 15, borderRadius: 18 / 2}}></View>
//                     </Body>

//                     <Right>
//                       <TouchableOpacity onPress={() => this.openChat(item)}>
//                         <Icon name="arrow-round-forward" />
//                       </TouchableOpacity>
//                     </Right>
//                   </ListItem>
//                 );
//               })}
//             </List>
//           )}
//         </Content>
//       </Container>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#313131',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: '100%',
//   },
//   text: {
//     fontSize: 30,
//   },
//   rtcview: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '40%',
//     width: '80%',
//     backgroundColor: 'black',
//   },
//   rtc: {
//     width: '80%',
//     height: '100%',
//   },
// });

import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  Content,
  List,
  ListItem,
  Body,
  Button,
  Header,
  Item,
  Container,
  Input,
  Left,
  Right,
  Thumbnail,
  Icon,
  Badge,
  Spinner,
} from 'native-base';
import {FlatList, RefreshControl} from 'react-native';

import {getData, postData} from '../../helpers/httpServices';
import {getDataFromToken} from '../../helpers/tokenutils';
import baseurl from '../../helpers/baseurl';

export default class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      loading: false,
      user_id: -1,
    };
  }

  componentDidMount = async () => {
    this.setState({loading: true});
    let result = await getDataFromToken();
    if (result.ok) {
      await this.setState({loading: false, user_id: result.data.id});
      await this.loadMatches();
    } else {
      alert('Session Expired. PLease Login again');
    }
    this.props.navigation.addListener('didFocus', async () => {
      await this.loadMatches();
    });
  };

  componentWillReceiveProps(props) {}

  loadMatches = async () => {
    this.setState({loading: true});
    let result = await getData(`like/load-matches-by-profileId/${this.state.user_id}`);
    if (result.ok) {
      await this.setState({matches: result.matches, loading: false});
    } else {
      alert('technical Error ');
    }
  };

  renderMatches = () => {
    return (
      <FlatList
        refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.loadMatches} />}
        data={this.state.matches}
        renderItem={({item}) => {
          return (
            <ListItem onPress={() => this.openChat(item)} thumbnail>
              <Left>
                <Thumbnail source={{uri: `${baseurl}/user_images/${item.profile_pic}`}} />
              </Left>
              <Body style={{width: '50%', flex: 1, flexDirection: 'row'}}>
                <Text style={{color: 'white', fontSize: 16}}>{item.username + '  '}</Text>
                {item.socket_id === undefined ? null : (
                  <View style={{backgroundColor: 'green', width: 15, height: 15, borderRadius: 18 / 2}}></View>
                )}
              </Body>
              <Right>
                <TouchableOpacity onPress={() => this.openChat(item)}>
                  <Icon name="arrow-round-forward" />
                </TouchableOpacity>
              </Right>
            </ListItem>
          );
        }}
        keyExtractor={item => item.id}
      />
    );
  };

  openChat = item => {
    this.props.screenProps.stackRef.navigate('ChatInterface', {
      user: item,
      socketRef: this.props.screenProps.socketRef,
    });
  };

  render() {
    return (
      <Container>
        <Text style={{color: 'white', marginBottom: '5%', padding: '2%', fontSize: 20, fontWeight: 'bold'}}>
          Your Matches
        </Text>
        {!this.state.loading && this.state.matches.length === 0 ? (
          <View style={{alignText: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>No Matches To Show...</Text>
          </View>
        ) : null}

        {this.state.loading ? <Spinner color="white" /> : this.renderMatches()}
      </Container>
    );
  }
}
