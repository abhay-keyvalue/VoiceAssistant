import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';
import LottieView from 'lottie-react-native';
import blobAnimation from '../../assets/animations/blobAnimation.json';

const ORB_SIZE = 180;

const VoiceWaveBlob: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [lottieProgress, setLottieProgress] = useState(0);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);
  const progress = useSharedValue(0);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  };


  const stopAudioAnalysis = useCallback(() => {
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
      analysisInterval.current = null;
    }

    progress.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });
  }, [ progress]);

  useEffect(() => {
    setupPlayer();
    return () => {
      cleanupPlayer();
      stopAudioAnalysis();
    };
  }, [stopAudioAnalysis]);

  const startAudioAnalysis = useCallback(() => {
    analysisInterval.current = setInterval(() => {
      // Mock: Replace this with actual audio metering data from a native module
      const mockAudioLevel = Math.random() * 0.5 + 1; // scale between 1.0 and 1.8
      // Map scale to progress (0-1)
      progress.value = withSpring((mockAudioLevel - 1) / 0.8, {
        damping: 10,
        stiffness: 100,
      });

    }, 150);
  }, [progress]);

  const cleanupPlayer = async () => {
    try {
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Error cleaning up TrackPlayer:', error);
    }
  };

  const handlePress = async () => {
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
    const currentProgress = progress.value;
    runOnJS(setLottieProgress)(currentProgress);
    return {
      transform: [
        { scale: 1 + progress.value },
      ],
    };
  });


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={[styles.orbContainer, animatedStyle]} />
        <LottieView
          source={blobAnimation}
          autoPlay={false}
          loop={false}
          speed={1}
          progress={lottieProgress}
          style={[styles.animation, animatedStyle]}
        />
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
    width: ORB_SIZE,
    height: ORB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3A6DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    backgroundColor: '#3A6DFF',
    borderRadius: '50%',
  },
  animation: {
    width: 300,
    height: 300,
  },
});

export default VoiceWaveBlob;
