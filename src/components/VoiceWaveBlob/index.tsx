import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, StyleSheet, Text, EmitterSubscription} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import TrackPlayer, {State, Event} from 'react-native-track-player';
import LottieView from 'lottie-react-native';
interface AudioConfig {
  url: string;
  title?: string;
  artist?: string;
}
interface AnimationConfig {
  type: 'default' | 'lottie';
  source?: any;
  size?: number;
  color?: string;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
}

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
 */
const VoiceWaveBlob: React.FC<VoiceWaveBlobProps> = ({
  audioConfig,
  animationConfig,
  isPlaying,
  onPlay,
  onStop,
}) => {
  const [lottieProgress, setLottieProgress] = useState(0);
  const analysisInterval = useRef<EmitterSubscription | null>(null);
  const progress = useSharedValue(0);
  const isPlayerInitialized = useRef(false);
  const updateInterval = useRef<NodeJS.Timeout | null>(null);

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
    if (isPlayerInitialized.current) {return;}

    try {
      await TrackPlayer.setupPlayer();
      isPlayerInitialized.current = true;
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  };

  /**
   * Updates the audio level and animation
   */
  const updateAudioLevel = useCallback(async () => {
    try {
      // Create a more dynamic value that simulates audio amplitude
      // Using multiple sine waves with different frequencies to create a more natural sound wave
      const time = Date.now() / 1000; // Current time in seconds
      const baseFrequency = 2; // Base frequency for the main wave
      const highFrequency = 8; // Higher frequency for detail
      const lowFrequency = 0.5; // Lower frequency for slow changes

      // Combine multiple sine waves with different frequencies and amplitudes
      const wave1 = Math.sin(time * baseFrequency) * 0.4;
      const wave2 = Math.sin(time * highFrequency) * 0.2;
      const wave3 = Math.sin(time * lowFrequency) * 0.3;

      // Add some randomness for more natural variation
      const randomFactor = Math.random() * 0.1;

      // Combine all waves and normalize to 0-1 range
      const dynamicValue = (wave1 + wave2 + wave3 + randomFactor + 1) / 2;

      // Map the dynamic value to our animation scale
      const mappedLevel = Math.min(1, Math.max(0, dynamicValue));

      progress.value = withSpring(mappedLevel, {
        damping: 15,
        stiffness: 120,
      });
      console.log('progress', progress.value);
    } catch (error) {
      console.error('Error getting audio progress:', error);
    }
  }, [progress]);

  /**
   * Starts the audio analysis animation using real-time audio level data
   */
  const startAudioAnalysis = useCallback(() => {
    if (analysisInterval.current) {
      analysisInterval.current.remove();
    }
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }

    // Add event listener for playback state changes
    const audioLevelListener = TrackPlayer.addEventListener(
      Event.PlaybackState,
      async (state) => {
        if (state.state === State.Playing) {
          // Start periodic updates when playing
          updateInterval.current = setInterval(updateAudioLevel, 30); // Increased frequency for smoother animation
        } else {
          // Clear interval when not playing
          if (updateInterval.current) {
            clearInterval(updateInterval.current);
            updateInterval.current = null;
          }
        }
      }
    );

    // Store the event listener reference
    analysisInterval.current = audioLevelListener;

    // Initial update
    updateAudioLevel();
  }, [updateAudioLevel]);

  /**
   * Stops the audio analysis and resets the animation
   */
  const stopAudioAnalysis = useCallback(() => {
    if (analysisInterval.current) {
      analysisInterval.current.remove();
      analysisInterval.current = null;
    }
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
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
            width: size * 0.6,
            height: size * 0.6,
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
