/* @flow */
import React, {Component} from 'react-native';
import AwesomeButton from 'react-native-awesome-button';

/* eslint-env browser */
/* eslint react/sort-comp: 0 */
/* eslint react/no-set-state: 0 */

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

  poll() {
    this.cancelled = false;
    this.polling = true;
    // TODO (mmr) ... post ...
  }

  cancel() {
    this.polling = false;
    this.cancelled = true;
    this.client.cancel();
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
