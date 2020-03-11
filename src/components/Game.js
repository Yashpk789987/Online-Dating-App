import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Input, Content, Item, Button} from 'native-base';
import Roulette from 'react-native-casino-roulette';
import wheel from '../../images/wheel.png';
import marker from '../../images/marker.png';

const numbers = [
  0,
  32,
  15,
  19,
  4,
  21,
  2,
  25,
  17,
  34,
  6,
  27,
  13,
  36,
  11,
  30,
  8,
  23,
  10,
  5,
  24,
  16,
  33,
  1,
  20,
  14,
  31,
  9,
  22,
  18,
  29,
  7,
  28,
  12,
  35,
  3,
  26,
];
const options = numbers.map(o => ({index: o}));
const customOptions = numbers.map(o => <Text index={o}>{o}</Text>);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onRotate = this.onRotate.bind(this);
    this.onRotateChange = this.onRotateChange.bind(this);
    this.onRotateCustom = this.onRotateCustom.bind(this);
    this.onRotateCustomChange = this.onRotateCustomChange.bind(this);
    this.state = {
      option: 'Option selected:',
      optionCustom: 'Option selected:',
      rouletteState: 'stop',
      rouletteCustomState: 'stop',
      chosenNumber: '',
      status: false,
    };
  }
  choseNumber = () => {
    if (this.state.chosenNumber == '') {
      alert('Please Enter Any Number ...');
    } else if (numbers.indexOf(parseInt(this.state.chosenNumber)) === -1) {
      alert('Input Valid Number');
    } else {
      alert('NUmber Selected ...');
    }
  };
  render() {
    const {option, rouletteState, optionCustom, rouletteCustomState} = this.state;
    return (
      <>
        <View style={{alignItems: 'center'}}>
          <Roulette
            enableUserRotate={rouletteState == 'stop'}
            background={wheel}
            onRotate={this.onRotate}
            onRotateChange={this.onRotateChange}
            marker={marker}
            options={options}
            markerWidth={20}></Roulette>
        </View>
        <Content style={{paddingLeft: '5%', paddingRight: '5%'}}>
          <Item regular>
            <Input
              onChangeText={text => this.setState({chosenNumber: text})}
              placeholder="Choose Number"
              keyboardType="phone-pad"
            />
          </Item>

          <Button
            style={{width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={this.choseNumber}>
            <Text style={{color: 'white', textAlign: 'center'}}>Select This Number</Text>
          </Button>
        </Content>
      </>
    );
  }
  onRotateChange(state) {
    if (state == 'stop') {
      if (this.state.option != this.state.chosenNumber) {
        alert('You Lost The Game ...');
      } else {
        alert('Hurray You Won  The Game ...');
      }
    }
    this.setState({
      rouletteState: state,
    });
  }

  onRotate(option) {
    this.setState({
      option: option.index,
    });
  }

  onRotateCustomChange(state) {
    this.setState({
      rouletteCustomState: state,
    });
  }

  onRotateCustom(option) {
    this.setState({
      optionCustom: option.props.index,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
