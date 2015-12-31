/**
 * @flow
 */
'use strict';

var React = require('react-native');
var Button = require('react-native-button');
var {
  AppRegistry,
  MapView,
  StyleSheet,
  Text,
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
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white'
  },
  pollButton: {
    backgroundColor: 'blue',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
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

class PollButton extends React.Component {
  poller: Poller;

  constructor(props) {
    super(props);
    this.poller = new Poller();
    this.state = {
      polling: false
    }
  }

  componentWillUnmount() {
    this.poller.cancel();
  }

  cancel() {
    this.setState({polling: false});
    this.poller.cancel();
  }

  poll() {
    this.setState({polling: true});
    this.poller.poll();
  }

  render() {
    if (this.state.polling) {
      var text = 'Polling...';
      var style = styles.cancelButton;
      var cb = this.cancel.bind(this);
    } else {
      var text = 'Poll';
      var style = styles.pollButton;
      var cb = this.poll.bind(this);
    }

    return <Button style={{borderWidth: 1}} onPress={cb}>{text}</Button>;
  }
}

class Poll extends React.Component {
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
