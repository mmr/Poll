/**
 * @flow
 */
'use strict';

var React = require('react-native');
var AwesomeButton = require('react-native-awesome-button');
var {
  AppRegistry,
  MapView,
  StyleSheet,
  Component,
  Text,
  View,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  map: {
    height: 480,
  },
  mapContainer: {
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonLabel: {
    color: 'white',
  },
});

class Client {
  xhr: XMLHttpRequest;
  downloading: boolean;
  cancelled: boolean;

  constructor() {
    this.downloading = false;
    this.cancelled = false;
  }

  post(url, payload, successCb, failureCb) {
    this.xhr && this.xhr.abort();
    var xhr = this.xhr || new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == xhr.DONE) {
        this.downloading = false;

        if (this.cancelled) {
          this.cancelled = false;
          return;
        }

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

  cancel() {
    this.cancelled = true;
    this.xhr && this.xhr.abort();
  }
}

class Poller {
  client: Client;
  polling: boolean;
  cancelled: boolean;

  constructor() {
    this.client = new Client();
    this.polling = false;
    this.cancelled = false;
  }

  poll() {
    this.cancelled = false;
    this.polling = true;
    // TODO (mmr) ... post ...
  }

  cancel() {
    this.polling = false;
    this.cancelled = true;
    this.client.cancel();
    alert('Polling cancelled');
  }
}

class PollButton extends Component {
  poller: Poller;

  constructor(props) {
    super(props);
    this.poller = new Poller();
    this.poll = this.poll.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      buttonState: 'idle'
    };
  }

  componentWillUnmount() {
    this.poller.cancel();
  }

  cancel() {
    this.setState({buttonState: 'idle'});
    this.poller.cancel();
  }

  poll() {
    this.setState({buttonState: 'polling'});
    this.poller.poll();
  }

  render() {
    return (
      <AwesomeButton
        backgroundStyle={styles.button}
        labelStyle={styles.buttonLabel}
        transitionDuration={200}
        states={{
          idle: {
            text: 'Poll',
            backgroundColor: '#1155DD',
            onPress: this.poll,
          },
          polling: {
            text: 'Polling... (press to cancel)',
            backgroundColor: '#002299',
            spinner: true,
            onPress: this.cancel,
          },
        }}
        buttonState={this.state.buttonState}
      />
    );
  }
}

class Poll extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} showsUserLocation={false} />
        </View>
        <PollButton />
      </View>
    );
  }
}

AppRegistry.registerComponent('Poll', () => Poll);
