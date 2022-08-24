/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';

const Divider = ({ color, width, style, borderWidth = 1.5 }) => {
  return (
    <View
      style={{
        background: 'red',
        borderBottomColor: color,
        borderBottomWidth: borderWidth,
        width: width,
        ...style,
      }}
    />
  );
};

export default Divider;
