/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import { Text } from '../../../components/common';
import { COLORS, rh, rw } from '../../../configs';

const heart = '../../../assets/animations/362-like.json';

const ShowLovePopup = ({ handleVisible, delay = 3000 }) => {
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
          elevation: 3,
          width: rw(50),
          height: rh(21),
          alignItems: 'center',
          backgroundColor: COLORS.inputTabBarBg,
          padding: rw(2),
          alignSelf: 'center',
        }}>
        <LottieView
          source={require(heart)}
          autoPlay
          loop
          width={rw(20)}
          height={rh(16)}
          style={{
            alignSelf: 'center',
            position: 'relative',
          }}
        />
        <Text size={10.5} bold color={COLORS.textLight}>
          علاقه مندی به پارتنر ارسال شد
        </Text>
      </Animated.View>
    </View>
  );
};

export default ShowLovePopup;
