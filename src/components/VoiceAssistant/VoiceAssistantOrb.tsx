import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import TrackPlayer from 'react-native-track-player';

const VoiceAssistantOrb: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const scale = useSharedValue(1);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setupPlayer();
    return () => {
      cleanupPlayer();
      stopAudioAnalysis();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupPlayer = async () => {
    try {
      console.log('Setting up TrackPlayer');
      await TrackPlayer.setupPlayer();
      console.log('TrackPlayer setup complete');
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  };

  const startAudioAnalysis = useCallback(() => {
    console.log('Starting audio analysis');
    analysisInterval.current = setInterval(() => {
      // Mock: Replace this with actual audio metering data from a native module
      const mockAudioLevel = Math.random() * 0.5 + 1; // scale between 1.0 and 1.8
      scale.value = withTiming(mockAudioLevel, { duration: 200 });
    }, 150);
  }, [scale]);

  const stopAudioAnalysis = useCallback(() => {
    console.log('Stopping audio analysis');
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
      analysisInterval.current = null;
    }
    scale.value = withTiming(1, { duration: 200 });
  }, [scale]);

  const cleanupPlayer = async () => {
    try {
      console.log('Cleaning up TrackPlayer');
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Error cleaning up TrackPlayer:', error);
    }
  };

  const handlePress = async () => {
    console.log('Orb pressed, current state:', isActive);
    if (!isActive) {
      await TrackPlayer.add({
        id: 'sample-audio',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'Sample Audio',
        artist: 'SoundHelix',
      });
      await TrackPlayer.play();
      startAudioAnalysis();
      setIsActive(true);
    } else {
      await cleanupPlayer();
      stopAudioAnalysis();
      setIsActive(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: 0.95,
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={[styles.orbContainer, animatedStyle]}>
          <LinearGradient
            colors={['#3A6DFF', '#011046']}
            style={styles.orb}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbContainer: {
    width: 180,
    height: 180,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3A6DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
  },
  orb: {
    width: '100%',
    height: '100%',
    borderRadius: 110,
  },
});

export default VoiceAssistantOrb;
