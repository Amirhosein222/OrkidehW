/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { Header, TabBar, Text } from '../../../components/common';

import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../../configs';

const heart = '../../../assets/animations/362-like.json';

const LoveNotificationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
      />
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          height: rh(40),
        }}>
        <LottieView
          source={require(heart)}
          autoPlay
          loop
          width={150}
          height={150}
          style={{ marginTop: rh(4), marginLeft: rw(15) }}
        />
        <Text bold xl marginTop={rh(15)}>
          I Love You
        </Text>
      </View>

      <TabBar seperate={true} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default LoveNotificationScreen;
