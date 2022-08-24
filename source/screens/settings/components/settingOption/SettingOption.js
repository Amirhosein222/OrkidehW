import React, { useState, useContext } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';

import { Text, Snackbar } from '../../../../components/common';
import { COLORS, rh, rw } from '../../../../configs';

import share from '../../../../assets/icons/drawerSettings/share.png';
import copy from '../../../../assets/icons/drawerSettings/copy.png';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';

const SettingOption = ({
  name = 'default',
  title,
  icon,
  navigateTo = null,
  onBuyAccount = null,
  isFetching = false,
  handleVisible = null,
}) => {
  const navigation = useNavigation();
  const { fullInfo } = useContext(WomanInfoContext);

  const handleOnPress = () => {
    if (name === 'vip') {
      return onBuyAccount();
    }
    navigateTo && navigation.navigate(navigateTo);
  };

  const shareCode = function () {
    Share.open({ message: fullInfo.regent_self, title: 'اشتراک گذاری کد شما' })
      .then((res) => {})
      .catch((err) => {
        err && console.log(err);
      });
  };

  const copyToClipboard = () => {
    Clipboard.setString(fullInfo.regent_self);
    handleVisible({
      msg: 'کد شما کپی شد.',
      visible: true,
      type: 'success',
    });
  };

  return (
    <View style={styles.container}>
      {name === 'invite' ? (
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={shareCode}>
            <Image style={{ width: 25, height: 25 }} source={share} />
          </Pressable>
          <Pressable onPress={copyToClipboard}>
            <Image
              style={{ width: 25, height: 25, marginLeft: rw(2) }}
              source={copy}
            />
          </Pressable>
        </View>
      ) : null}
      {name !== 'exit' && name !== 'invite' ? (
        <Pressable hitSlop={7} onPress={handleOnPress}>
          {isFetching ? (
            <ActivityIndicator size="small" color={COLORS.textLight} />
          ) : (
            <Image
              style={{ width: 25, height: 25 }}
              source={require('../../../../assets/icons/drawerSettings/next-page.png')}
            />
          )}
        </Pressable>
      ) : (
        <View />
      )}

      <View style={{ flexDirection: 'row' }}>
        <Text
          color={
            name === 'exit'
              ? COLORS.error
              : name === 'vip'
              ? COLORS.primary
              : COLORS.textDark
          }
          marginRight={rw(2)}>
          {title}
        </Text>
        {name === 'cycles' ? (
          <Ionicons
            name="ios-sync-circle-outline"
            size={25}
            color={COLORS.textDark}
          />
        ) : (
          <Image style={{ width: 25, height: 25 }} source={icon} />
        )}
      </View>
    </View>
  );
};

export default SettingOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: rw(81),
    marginTop: rh(3),
    marginVertical: rh(0.5),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(1),
  },
});
