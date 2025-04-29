/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import VoiceAssistantOrb from './src/components/VoiceAssistant/VoiceAssistantOrb';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <VoiceAssistantOrb />
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
