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
  const isPeriodDay = useIsPeriodDay();

  return (
    <View style={styles.pregnancyContainer}>
      {/* <View style={{ width: rw(100), height: rh(20) }}> */}

      {/* </View> */}

      {/* <Image
        source={
          isPeriodDay
            ? require('../../../../assets/images/600.png')
            : require('../../../../assets/images/500.png')
        }
        style={{
          width: rw(82),
          height: rh(43),
          marginTop: rh(4),
        }}
        resizeMode="contain"
      /> */}

      <LottieView
        source={require(hobab)}
        autoPlay
        loop
        style={{
          width: 360,
          height: 360,
          marginTop: rh(2),
        }}
      />
      {!isFetching ? (
        <View style={styles.pregnancyPercentText}>
          <Text size={38} bold color={COLORS.white}>
            {pregnancy && numberConverter(pregnancy)}
          </Text>
          <Text size={20} bold color={COLORS.white}>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(2),
  },
  pregnancyPercentText: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(6),
    marginRight: rw(2),
    // top: rh(19),
  },
});

export default Pregnancy;
