import React from 'react';
import {Container, Text, Spinner} from 'native-base';

export default class Logout extends React.Component {
  render() {
    return (
      <Container style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Spinner color="white" />
        <Text style={{color: 'white'}}>Logging Out ...</Text>
      </Container>
    );
  }
}
