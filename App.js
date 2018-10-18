'use strict';
import React, { Component } from 'react';
import {
  Platform,
  //StyleSheet,
  //Text,
  //View
} from 'react-native';

import {
  createStackNavigator,
} from 'react-navigation';
import Maps from './Maps';
import Detail from './Detail';
// import Maps from './Maps';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
const App = createStackNavigator({
  // Home: { screen: SearchPage},
  // Results: {screen: SearchResults},
  // Details: {screen: PropertyView},
  Mapsview: {screen: Maps},
  Details: {screen: Detail},
});
export default App;
