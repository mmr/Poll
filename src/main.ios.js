/* @flow */
'use strict'
import {AppRegistry} from 'react-native';
import App from './components/App';

class Root extends App {
  // nothing
}

AppRegistry.registerComponent('App', () => Root);
