/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import LottieView from 'lottie-react-native';

import { useIsPeriodDay } from '../../../../libs/hooks';

import { Text } from '../../../../components/common';
import { COLORS, rh, rw } from '../../../../configs';
import { numberConverter } from '../../../../libs/helpers';

const hobab = '../../../../assets/animations/hobab1.json';

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
        }}
        resizeMode="contain"
      /> */}
      {!isFetching ? (
        <View style={styles.pregnancyPercentText}>
          <Text size={40} bold color={COLORS.white}>
            {/* {pregnancy && numberConverter(pregnancy)} */}
            20%
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
      <LottieView
        source={require(hobab)}
        autoPlay
        loop
        width={650}
        height={650}
        style={{
          top: rh(-7),
          left: isFetching ? rh(-18) : rh(-15),
          position: 'absolute',
        }}
      />
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
    // ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    top: rh(17),
    height: rh(15),
    zIndex: 1,
  },
});

export default Pregnancy;
