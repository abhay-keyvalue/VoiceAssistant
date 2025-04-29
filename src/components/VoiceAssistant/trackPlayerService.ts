import TrackPlayer from 'react-native-track-player';

let isPlayerInitialized = false;

export const setupTrackPlayer = async () => {
  try {
    if (!isPlayerInitialized) {
      await TrackPlayer.setupPlayer();
      isPlayerInitialized = true;
    }
    await TrackPlayer.add({
      id: 'sample-audio',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      title: 'Sample Audio',
      artist: 'SoundHelix',
    });
    await TrackPlayer.play();
  } catch (error) {
    console.error('Error setting up TrackPlayer:', error);
  }
};

export const cleanupTrackPlayer = async () => {
  try {
    await TrackPlayer.reset();
    isPlayerInitialized = false;
  } catch (error) {
    console.error('Error cleaning up TrackPlayer:', error);
  }
}; 