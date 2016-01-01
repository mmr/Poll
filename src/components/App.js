/* @flow */
import React, {Component} from 'react-native';
import PollButton from './PollButton';

const {
  StyleSheet,
  MapView,
  View,
} = React;

const styles = StyleSheet.create({
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
});

class App extends Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.mapContainer}>
            <MapView
                showsUserLocation={false}
                style={styles.map}
            />
          </View>
          <PollButton />
        </View>
      );
  }
}

export default App;
