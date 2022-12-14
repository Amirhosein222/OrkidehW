/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import LottieView from 'lottie-react-native';

import { useIsPeriodDay } from '../../../../libs/hooks';

import { Text } from '../../../../components/common';
import { COLORS, HEIGHT, rh, rw, WIDTH } from '../../../../configs';
import { numberConverter } from '../../../../libs/helpers';

const hobab = '../../../../assets/animations/hobab_khanom.json';

const Pregnancy = ({ pregnancy, isFetching }) => {
  return (
    <View style={styles.pregnancyContainer}>
      <LottieView
        source={require(hobab)}
        autoPlay
        loop
        style={{
          width: 300,
          height: 300,
        }}
      />
      {!isFetching ? (
        <View style={styles.pregnancyPercentText}>
          <Text size={32} bold color={COLORS.white}>
            {pregnancy && numberConverter(pregnancy)}
          </Text>
          <Text size={16} bold color={COLORS.white}>
            احتمال بارداری
          </Text>
        </View>
      ) : (
        <View style={styles.pregnancyPercentText}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pregnancyContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  pregnancyPercentText: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(2),
  },
});

export default Pregnancy;
