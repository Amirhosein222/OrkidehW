/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../index';
import { rw, rh, COLORS, STATUS_BAR_HEIGHT } from '../../../configs';

import Back from '../../../assets/icons/btns/back.svg';

const ScreenHeader = ({
  title,
  disableBack = false,
  style,
  customOnPress = null,
}) => {
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
        onPress={
          customOnPress ? () => customOnPress() : () => navigation.goBack()
        }>
        <Back style={{ width: 28, height: 28 }} />
      </Pressable>
      <Text size={16.5} bold color={COLORS.textLight}>
        {title}
      </Text>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({});
