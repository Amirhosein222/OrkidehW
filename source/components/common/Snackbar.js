/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import { Text } from './index';
import { COLORS, rh, rw } from '../../configs';

const Snackbar = ({
  message,
  type = 'error',
  handleVisible,
  delay = 1500,
  style = {},
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      top: 45,
      left: 0,
      right: 0,
    },
  });

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(delay),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleVisible();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          justifyContent: 'center',
          opacity: opacity,
          transform: [
            {
              translateY: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
          width: rw(80),
          height: rh(8),
          alignSelf: 'center',
          margin: 10,
          marginBottom: 5,
          backgroundColor: type === 'success' ? COLORS.success : COLORS.error,
          padding: 10,
          borderRadius: 35,
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 5,
          elevation: 6,
          alignItems: 'center',
          ...style,
        }}>
        <Text color={COLORS.white}>{message}</Text>
      </Animated.View>
    </View>
  );
};

export default Snackbar;
