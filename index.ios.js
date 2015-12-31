/**
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  MapView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 497,
    borderWidth: 1,
    borderColor: 'black',
  },
  mapContainer: {
    margin: 5,
    marginTop: 20,
  },
  buttonPressed: {
    flex: 1,
    height: 40,
    backgroundColor: 'gray',
  },
  buttonNotPressed: {
    flex: 1,
    height: 40,
    backgroundColor: 'gray',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white'
  },
});

var PollButton = React.createClass({
  getInitialState: function() {
    return {
      toggled: false
    };
  },

  _onPress: function() {
    this.setState({
      toggled: !this.state.toggled
    });
  },

  render: function() {
    var buttonStyle = this.state.toggled ? styles.buttonPressed : styles.buttonNotPressed;

    return (
      <TouchableHighlight onPress={this._onPress}>
        <View style={buttonStyle}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>
              Poll
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
});

var Poll = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} showsUserLocation={true} />
        </View>
        <PollButton />
      </View>
    );
  }
});

AppRegistry.registerComponent('Poll', () => Poll);
