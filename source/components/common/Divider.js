/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';

const Divider = ({ color, width, style }) => {
  return (
    <View
      style={{
        background: 'red',
        borderBottomColor: color,
        borderBottomWidth: 1.5,
        width: width,
        ...style,
      }}
    />
  );
};

export default Divider;
