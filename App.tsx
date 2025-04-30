/**
 * Main App Component
 * 
 * This is the root component of the application that demonstrates the VoiceWaveBlob component.
 * It provides controls to play and stop audio playback, which affects the VoiceWaveBlob animation.
 * 
 * @component
 */
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import VoiceWaveBlob from './src/components/VoiceWaveBlob';
import blobAnimation from './src/assets/animations/blobAnimation.json';

const App = () => {
  // State to control audio playback
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * Handles the play button press
   * Sets isPlaying state to true, which triggers audio playback
   */
  const handlePlay = () => {
    setIsPlaying(true);
  };

  /**
   * Handles the stop button press
   * Sets isPlaying state to false, which stops audio playback
   */
  const handleStop = () => {
    setIsPlaying(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* VoiceWaveBlob component with configuration */}
      <VoiceWaveBlob
        audioConfig={{
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          title: 'Sample Audio',
          artist: 'SoundHelix',
        }}
        animationConfig={{
          type: 'lottie',
          source: blobAnimation,
          color: '#3A6DFF',
          shadowColor: '#3A6DFF',
          shadowOpacity: 0.9,
          shadowRadius: 30,
        }}
        isPlaying={isPlaying}
        onPlay={() => console.log('Playing')}
        onStop={() => console.log('Stopped')}
      />
      {/* Control buttons container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={handlePlay}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStop}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /** Main container style */
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  /** Container for control buttons */
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  /** Base button style */
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  /** Style for the play button */
  playButton: {
    backgroundColor: '#4CAF50',
  },
  /** Style for the stop button */
  stopButton: {
    backgroundColor: '#F44336',
  },
  /** Style for button text */
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
