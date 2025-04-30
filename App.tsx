/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import VoiceWaveBlob from './src/components/VoiceWaveBlob';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <VoiceWaveBlob />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
