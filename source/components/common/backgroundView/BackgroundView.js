/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ImageBackground } from 'react-native';

import background from '../../../assets/images/background.png';
import { COLORS, rh, rw } from '../../../configs';

const BackgroundView = ({ children, style, resizeMode = null }) => {
  return (
    <ImageBackground
      source={background}
      style={{
        backgroundColor: COLORS.mainBg,
        width: '100%', // applied to Image
        height: '100%',
        alignItems: 'center',
        ...style,
      }}
      imageStyle={{
        resizeMode: 'cover', // works only here!
      }}>
      {children}
    </ImageBackground>
  );
};

export default BackgroundView;
