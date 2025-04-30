# Voice Assistant

A React Native application featuring an animated voice assistant with dynamic audio visualization. The app demonstrates real-time audio playback with a responsive visual interface.

## Features

- 🎵 Audio playback using react-native-track-player
- 🎨 Dynamic blob animation that responds to audio
- 🎭 Support for both default and Lottie animations
- 📱 Cross-platform support (iOS & Android)
- 🎮 Interactive play/stop controls
- 🌈 Customizable animation parameters

## Prerequisites

- Node.js (>=18)
- React Native development environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and Android SDK

## Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/VoiceAssistant.git
cd VoiceAssistant
```

2. Install dependencies:
```sh
# Using npm
npm install

# OR using Yarn
yarn install
```

3. Install iOS dependencies:
```sh
cd ios
pod install
cd ..
```

## Running the App

### Start Metro
```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Run on iOS
```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

### Run on Android
```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

## Project Structure

```
VoiceAssistant/
├── src/
│   ├── components/
│   │   └── VoiceWaveBlob/
│   │       ├── index.tsx      # Main component with audio visualization
│   │       └── styles.ts      # Component styles
│   ├── assets/
│   │   └── animations/        # Lottie animation files
│   └── App.tsx               # Main application component
├── ios/                      # iOS native code
├── android/                  # Android native code
└── package.json             # Project dependencies
```

## Component Usage

The `VoiceWaveBlob` component can be used as follows:

```typescript
import VoiceWaveBlob from './src/components/VoiceWaveBlob';

// In your component:
<VoiceWaveBlob
  audioConfig={{
    url: 'https://example.com/audio.mp3',
    title: 'Sample Audio',
    artist: 'Artist Name',
  }}
  animationConfig={{
    type: 'lottie', // or 'default'
    source: require('./path/to/animation.json'),
    size: 220,
    color: '#3A6DFF',
    shadowColor: '#3A6DFF',
    shadowOpacity: 0.9,
    shadowRadius: 30,
  }}
  isPlaying={isPlaying}
  onPlay={() => console.log('Playing')}
  onStop={() => console.log('Stopped')}
/>
```

## Configuration Options

### AudioConfig
- `url`: Audio file URL
- `title`: Optional audio title
- `artist`: Optional artist name

### AnimationConfig
- `type`: 'default' or 'lottie'
- `source`: Lottie animation file (required for type 'lottie')
- `size`: Animation size in pixels
- `color`: Blob color
- `shadowColor`: Shadow color
- `shadowOpacity`: Shadow opacity (0-1)
- `shadowRadius`: Shadow radius

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Native](https://reactnative.dev)
- [react-native-track-player](https://github.com/doublesymmetry/react-native-track-player)
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- [Lottie](https://lottiefiles.com)
