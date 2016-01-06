/* @flow */
import React, {Component} from 'react-native';
import AwesomeButton from 'react-native-awesome-button';

/* eslint-env browser */
/* eslint react/no-set-state: 0 */
/* global URLSearchParams */

const styles = React.StyleSheet.create({
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

const POLL_TIME_IN_MILLIS = 10000;

class Client {
  xhr: XMLHttpRequest;
  downloading: boolean;
  cancelled: boolean;

  constructor() {
    this.downloading = false;
    this.cancelled = false;
  }

  post(url: string, body: Object, successCb: Function, failureCb: Function) {
    if (this.xhr) {
      this.xhr.abort();
    }
    let xhr = this.xhr || new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        this.downloading = false;

        if (this.cancelled) {
          this.cancelled = false;
          return;
        }

        const resp = xhr.responseText;
        if (xhr.status === 200) {
          successCb(resp);
        } else {
          failureCb(resp, xhr.status);
        }
      }
    };

    xhr.open('POST', url);
    xhr.send(body);
    this.xhr = xhr;
    this.downloading = true;
  }

  cancel() {
    this.cancelled = true;
    if (this.xhr) {
      this.xhr.abort();
    }
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

  pollUber() {
    const lat = -23.484957;
    const lng = -46.864309;
    const token = 'my_token';
    let params = new URLSearchParams();
    params.append('server_token', token);
    params.append('start_latitude', lat);
    params.append('start_longitude', lng);

    let etaUrl = 'https://api.uber.com/v1/estimates/time?';
    etaUrl += params;

    fetch(etaUrl)
      .then((resp) => resp.text())
      // .then((body) => {
      .then(() => {
        setTimeout(self.pollUber, POLL_TIME_IN_MILLIS);
      })
      // .catch((err) => {
      .catch(() => {
        // ...
      });
  }

  poll() {
    this.cancelled = false;
    this.polling = true;
    self.pollUber();
  }

  cancel() {
    this.polling = false;
    this.cancelled = true;
    this.client.cancel();
  }
}

class PollButton extends Component {
  poller: Poller;

  constructor() {
    super();
    this.poller = new Poller();
    this.poll = this.poll.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      buttonState: 'idle',
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
            buttonState={this.state.buttonState}
            labelStyle={styles.buttonLabel}
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
            transitionDuration={200}
        />
      );
  }
}

export default PollButton;
