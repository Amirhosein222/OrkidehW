import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Text } from '../common';
import { Bars } from '../charts';
import { COLORS, rh, rw } from '../../configs';

const PMSCard = ({ info, hasBar, icon }) => {
  return (
    <View style={{ ...styles.container, width: hasBar ? rw(40) : rw(34.8) }}>
      <Image source={icon} style={{ width: 80, height: 80 }} />
      <Text small color={COLORS.textLight}>
        {info.title}
      </Text>
      {!hasBar && (
        <View style={{ flexDirection: 'row', marginTop: rh(0.5) }}>
          <Text small color={COLORS.textLight} marginRight={rw(1)}>
            بار
          </Text>
          <Text color={COLORS.textDark}>{info.count}</Text>
        </View>
      )}

      {hasBar && <Bars data={info} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(34.8),
    backgroundColor: COLORS.cardBg,
    paddingVertical: rh(2),
    elevation: 3,
    borderRadius: 12,
    alignSelf: 'center',
    marginHorizontal: rw(2),
  },
});

export default PMSCard;
