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

class Client {
  xhr: XMLHttpRequest;
  downloading: boolean;

  constructor() {
    this.downloading = false;
  }

  post(url, payload, successCb, failureCb) {
    this.xhr && this.xhr.abort();
    var xhr = this.xhr || new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == xhr.DONE) {
        this.downloading = false;

        resp = xhr.responseText;
        if (xhr.status === 200) {
          successCb(resp);
        } else {
          failureCb(resp, xhr.status);
        }
      }
    };

    xhr.open('POST', url);
    xhr.send(payload);
    this.xhr = xhr;
    this.downloading = true;
  }
}


class PollButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toggled: false
    };
  }

  _onPress() {
    this.setState({
      toggled: !this.state.toggled
    });
  }

  render() {
    var buttonStyle = this.state.toggled ? styles.buttonPressed : styles.buttonNotPressed;

    return (
      <TouchableHighlight onPress={this._onPress.bind(this)}>
        <View style={buttonStyle}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>
              Poll
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

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
