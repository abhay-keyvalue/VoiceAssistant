import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import TrackPlayer, {State} from 'react-native-track-player';
import LottieView from 'lottie-react-native';

/**
 * Configuration interface for audio playback
 * @interface AudioConfig
 * @property {string} url - URL of the audio file to play
 * @property {string} [title] - Optional title of the audio track
 * @property {string} [artist] - Optional artist name
 */
interface AudioConfig {
  url: string;
  title?: string;
  artist?: string;
}

/**
 * Configuration interface for animation appearance
 * @interface AnimationConfig
 * @property {'default' | 'lottie'} type - Type of animation to display
 * @property {any} [source] - Lottie animation source (required for 'lottie' type)
 * @property {number} [size] - Size of the animation in pixels
 * @property {string} [color] - Color of the default animation
 * @property {string} [shadowColor] - Color of the shadow
 * @property {number} [shadowOpacity] - Opacity of the shadow (0-1)
 * @property {number} [shadowRadius] - Radius of the shadow in pixels
 */
interface AnimationConfig {
  type: 'default' | 'lottie';
  source?: any;
  size?: number;
  color?: string;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
}

/**
 * Props interface for the VoiceWaveBlob component
 * @interface VoiceWaveBlobProps
 * @property {AudioConfig} audioConfig - Configuration for audio playback
 * @property {AnimationConfig} animationConfig - Configuration for animation appearance
 * @property {boolean} isPlaying - Controls whether the audio is playing
 * @property {() => void} [onPlay] - Optional callback when audio starts playing
 * @property {() => void} [onStop] - Optional callback when audio stops playing
 */
interface VoiceWaveBlobProps {
  audioConfig: AudioConfig;
  animationConfig: AnimationConfig;
  isPlaying: boolean;
  onPlay?: () => void;
  onStop?: () => void;
}

// Default values for animation configuration
const DEFAULT_ORB_SIZE = 220;
const DEFAULT_COLOR = '#3A6DFF';
const DEFAULT_SHADOW_COLOR = '#3A6DFF';
const DEFAULT_SHADOW_OPACITY = 0.9;
const DEFAULT_SHADOW_RADIUS = 30;

/**
 * VoiceWaveBlob Component
 *
 * A React Native component that displays an animated blob that responds to audio playback.
 * It supports two types of animations: a default circular blob or a custom Lottie animation.
 * The component can be controlled externally through the isPlaying prop.
 *
 * @component
 * @example
 * <VoiceWaveBlob
 *   audioConfig={{
 *     url: 'https://example.com/audio.mp3',
 *     title: 'Sample Audio',
 *     artist: 'Artist Name'
 *   }}
 *   animationConfig={{
 *     type: 'default',
 *     size: 200,
 *     color: '#3A6DFF'
 *   }}
 *   isPlaying={true}
 *   onPlay={() => console.log('Playing')}
 *   onStop={() => console.log('Stopped')}
 * />
 */
const VoiceWaveBlob: React.FC<VoiceWaveBlobProps> = ({
  audioConfig,
  animationConfig,
  isPlaying,
  onPlay,
  onStop,
}) => {
  const [lottieProgress, setLottieProgress] = useState(0);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);
  const progress = useSharedValue(0);
  const isPlayerInitialized = useRef(false);

  const {
    type = 'default',
    source = null,
    size = DEFAULT_ORB_SIZE,
    color = DEFAULT_COLOR,
    shadowColor = DEFAULT_SHADOW_COLOR,
    shadowOpacity = DEFAULT_SHADOW_OPACITY,
    shadowRadius = DEFAULT_SHADOW_RADIUS,
  } = animationConfig;

  /**
   * Sets up the TrackPlayer for audio playback
   * @async
   */
  const setupPlayer = async () => {
    if (isPlayerInitialized.current) return;

    try {
      await TrackPlayer.setupPlayer();
      isPlayerInitialized.current = true;
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  };

  /**
   * Stops the audio analysis and resets the animation
   */
  const stopAudioAnalysis = useCallback(() => {
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
      analysisInterval.current = null;
    }

    progress.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });
    setLottieProgress(0);
  }, [progress]);

  // Setup and cleanup on mount/unmount
  useEffect(() => {
    setupPlayer();
    return () => {
      cleanupPlayer();
      stopAudioAnalysis();
    };
  }, [stopAudioAnalysis]);

  /**
   * Starts the audio analysis animation
   * Currently uses mock data, but can be replaced with actual audio metering
   */
  const startAudioAnalysis = useCallback(() => {
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
    }

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

  /**
   * Cleans up the TrackPlayer instance
   */
  const cleanupPlayer = async () => {
    try {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        await TrackPlayer.pause();
      }
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Error cleaning up TrackPlayer:', error);
    }
  };

  /**
   * Starts audio playback and animation
   */
  const startPlayback = useCallback(async () => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'custom-audio',
        url: audioConfig.url,
        title: audioConfig.title || 'Custom Audio',
        artist: audioConfig.artist || 'Unknown',
      });
      await TrackPlayer.play();
      startAudioAnalysis();
      if (onPlay) {
        onPlay();
      }
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  }, [audioConfig, onPlay, startAudioAnalysis]);

  /**
   * Stops audio playback and animation
   */
  const stopPlayback = useCallback(async () => {
    try {
      await cleanupPlayer();
      stopAudioAnalysis();
      if (onStop) {
        onStop();
      }
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }, [onStop, stopAudioAnalysis]);

  // Control playback based on isPlaying prop
  useEffect(() => {
    if (isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  /**
   * Creates the animated style for the blob
   */
  const animatedStyle = useAnimatedStyle(() => {
    const currentProgress = progress.value;
    runOnJS(setLottieProgress)(currentProgress);
    return {
      transform: [{scale: 1 + progress.value}],
    };
  });

  const renderDefaultBlob = () => {
    return (
      <Animated.View
        style={[
          styles.orbContainer,
          animatedStyle,
          {
            width: size,
            height: size,
            backgroundColor: color,
            shadowColor,
            shadowOpacity,
            shadowRadius,
          },
        ]}
      />
    );
  };

  const renderLottieBlob = () => {
    return (
      <LottieView
        source={source}
        autoPlay={false}
        loop={false}
        speed={1}
        progress={lottieProgress}
        style={[styles.animation, animatedStyle, {width: size, height: size}]}
      />
    );
  };

  const renderNoAnimation = () => {
    return (
      <Text style={styles.noAnimationText}>No animation source provided</Text>
    );
  };

  return (
    <View style={styles.container}>
      {type === 'default'
        ? renderDefaultBlob()
        : type === 'lottie' && source
        ? renderLottieBlob()
        : renderNoAnimation()}
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    borderRadius: '50%',
  },
  animation: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAnimationText: {
    color: 'red',
  },
});

export default VoiceWaveBlob;
