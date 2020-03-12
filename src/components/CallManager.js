///// DEMO FOR IMPLEMENTIG CALLING MANAGEMENT /////

import React, {useState, useEffect} from 'react';
import InCallManager from 'react-native-incall-manager';
import {Text, TouchableOpacity} from 'react-native';
import RNCallKeep from 'react-native-callkeep';

const options = {
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
  },
};
export default class CallManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    try {
      // InCallManager.start({media: 'video'});
      // InCallManager.setKeepScreenOn(true);
      // InCallManager.setForceSpeakerphoneOn(true);
      RNCallKeep.setup(options);
      RNCallKeep.addEventListener('answerCall', data => {
        console.log(data);
      });
    } catch (error) {
      console.log(error);
    }
  }

  //   componentWillUnmount() {
  //     InCallManager.stop();
  //   }

  makeCall = () => {
    InCallManager.stop();
    // try {
    //   RNCallKeep.setup(options);
    //   RNCallKeep.setAvailable(true);
    // RNCallKeep.setCurrentCallActive('uuid');
    // RNCallKeep.startCall('uuid', '9630884259', 'friend');
    //   RNCallKeep.displayIncomingCall('uuid', '9630884259', 'friend');
    // } catch (error) {
    //   console.log(error);
    // }
  };

  render() {
    return (
      <TouchableOpacity onPress={() => this.makeCall()}>
        <Text style={{color: 'black'}}>Call Manager</Text>
      </TouchableOpacity>
    );
  }
}
