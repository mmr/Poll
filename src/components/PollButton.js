/* @flow */
import React, {Component} from 'react-native';
import AwesomeButton from 'react-native-awesome-button';

/* eslint-env browser */
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

// const POLL_TIME_IN_MILLIS = 10000;
const GPS_TIMEOUT_IN_MILLIS = 20000;
const GPS_MAX_AGE_IN_MILLIS = 60000;

// FIXME (mmr) : hardcoded prodcut (uberX) for now
const PRODUCT_ID = 'd5ef01d9-7d54-413e-b265-425948d06e92';

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

class Car {
  estimate: Number;

  constructor(estimate: Number) {
    this.estimate = estimate;
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

  handleError(err) {
    /* eslint no-console: 0 */
    console.log(err.message);
    this.cancel();
  }

  handleResp(resp) {
    if (resp.status >= 200 && resp.status <= 299) {
      return resp.json();
    }
    let err = new Error(resp.statusText);
    err.response = resp;
    throw err;
  }

  pollUber(position, carsFoundCb: Function) {
    const token = 'De9IpR3cxQJ9pMrmhiIUqo_wmyA0mzQ3lBwapEL1';
    this.polling = false;

    let {latitude, longitude} = position.coords;
    let params = `server_token=${token}`;
    params += `&start_latitude=${latitude}`;
    params += `&start_longitude=${longitude}`;
    params += `&product_id=${PRODUCT_ID}`;
    let etaUrl = `https://api.uber.com/v1/estimates/time?${params}`;
    console.log(`polling: ${etaUrl}`);

    fetch(etaUrl)
      .then((resp) => this.handleResp(resp))
      .then((body) => {
        // XXX (mmr) : why cant we use for..of here?
        // let cars = [for (t of body.times) new Car(t.etimate)];
        let cars = [];
        body.times.forEach((t) => {
          cars.append(new Car(t.estimate));
        });
        carsFoundCb(cars);
        // setTimeout(this.pollUber, POLL_TIME_IN_MILLIS);
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  poll(carsFoundCb) {
    this.cancelled = false;
    this.polling = true;

    navigator.geolocation.getCurrentPosition(
      (position) => this.pollUber(position, carsFoundCb),
      (error) => this.handleError(error),
      {
        enableHighAccuracy: true,
        timeout: GPS_TIMEOUT_IN_MILLIS,
        maximumAge: GPS_MAX_AGE_IN_MILLIS,
      });
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

/*
// XXX (mmr) : is this really needed?
  componentWillUnmount() {
    this.poller.cancel();
  }
*/

  cancel() {
    this.setState({buttonState: 'idle'});
    this.poller.cancel();
  }

  notifyCarsFound(carsFound) {
    /* eslint no-console: 0 */
    console.log(carsFound);
    this.setState({buttonState: 'idle'});
  }

  poll() {
    this.setState({buttonState: 'polling'});
    this.poller.poll((carsFound) => this.notifyCarsFound(carsFound));
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
