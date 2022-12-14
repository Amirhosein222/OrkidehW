/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import { rh, rw } from '../../../configs';

const love = '../../../assets/animations/100025-email-send-love-letter.json';

const ShowLovePopup = ({ handleVisible, delay = 1000 }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      top: rh(10),
      left: 0,
      right: 0,
      zIndex: 1000,
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
          borderRadius: 12,
          // elevation: 3,
          width: rw(50),
          height: rh(21),
          alignItems: 'center',
          backgroundColor: 'transparent',
          padding: rw(2),
          alignSelf: 'center',
        }}>
        <LottieView
          source={require(love)}
          autoPlay
          style={{
            width: 400,
            height: 400,
            alignSelf: 'center',
            position: 'relative',
          }}
        />
      </Animated.View>
    </View>
  );
};

export default ShowLovePopup;
