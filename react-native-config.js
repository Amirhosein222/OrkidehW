module.exports = {
  project: {
    android: {},
  },
  assets: ['./source/assets/fonts/'],
  dependencies: {
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-video/android-exoplayer',
        },
      },
    },
    'react-native-pusher-push-notifications': {
      platforms: {
        android: null, // this skips autolink for android
      },
    },
  },
};
