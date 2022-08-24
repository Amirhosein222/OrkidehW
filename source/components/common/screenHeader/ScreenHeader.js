/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React from 'react';
import { Image, StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../index';
import { rw, rh, COLORS, STATUS_BAR_HEIGHT } from '../../../configs';

const ScreenHeader = ({ title, disableBack = false, style }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        width: rw(100),
        alignItems: 'center',
        paddingHorizontal: rw(8),
        justifyContent: 'space-between',
        height: rh(6),
        marginTop: STATUS_BAR_HEIGHT + rh(2),
        ...style,
      }}>
      <Pressable
        disabled={disableBack}
        hitSlop={5}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../assets/icons/btns/back.png')}
          style={{ width: 30, height: 30 }}
        />
      </Pressable>
      <Text large color={COLORS.textLight}>
        {title}
      </Text>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({});
