import React from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';

import { useIsPeriodDay } from '../../../../libs/hooks';

import { Text } from '../../../../components/common';
import { numberConverter } from '../../../../libs/helpers';
import { COLORS, rh, rw } from '../../../../configs';

const Pregnancy = ({ pregnancy, isFetching }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <View style={styles.pregnancyContainer}>
      <Image
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
      />
      {!isFetching ? (
        <View style={styles.pregnancyPercentText}>
          <Text size={45} bold color={COLORS.white}>
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
    bottom: rh(5),
  },
});

export default Pregnancy;
