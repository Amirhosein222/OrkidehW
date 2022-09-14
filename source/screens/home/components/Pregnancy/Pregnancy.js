import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { useIsPeriodDay } from '../../../../libs/hooks';

import { Image, Text } from '../../../../components/common';
import { numberConverter } from '../../../../libs/helpers';
import { COLORS, rh, rw } from '../../../../configs';

const Pregnancy = ({ pregnancy, isFetching }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <View style={styles.pregnancyContainer}>
      <Image
        imageSource={
          isPeriodDay
            ? require('../../../../assets/images/600.png')
            : require('../../../../assets/images/500.png')
        }
        width={rw(90)}
        height={rh(46)}
      />
      {!isFetching ? (
        <View style={styles.pregnancyPercentText}>
          <Text bold xl color={COLORS.white}>
            {pregnancy && numberConverter(pregnancy)}
          </Text>
          <Text large color={COLORS.white}>
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
    marginTop: rh(4),
  },
  pregnancyPercentText: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: rh(5),
  },
});

export default Pregnancy;
