/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';

import { Text } from '../../../../components/common';
import { COLORS, ICON_SIZE, rh, rw } from '../../../../configs';

import ShareIcon from '../../../../assets/icons/drawerSettings/share.svg';
import Copy from '../../../../assets/icons/drawerSettings/copy.svg';
import NextPage from '../../../../assets/icons/drawerSettings/nextPage.svg';

import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';

const SettingOption = ({
  name = 'default',
  title,
  Icon,
  navigateTo = null,
  onBuyAccount = null,
  isFetching = false,
  handleVisible = null,
  openExitModal,
}) => {
  const navigation = useNavigation();
  const { fullInfo } = useContext(WomanInfoContext);

  const handleOnPress = () => {
    if (name === 'vip') {
      return onBuyAccount();
    }
    if (name === 'exit') {
      return openExitModal();
    }
    navigateTo && navigation.navigate(navigateTo);
  };

  const shareCode = function () {
    Share.open({
      message: fullInfo.regent_self,
      title: `اشتراک گذاری کد شما: ${fullInfo.regent_self}`,
    })
      .then(res => {})
      .catch(err => {
        // err && console.log(err);
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
    <Pressable
      disabled={name === 'invite' ? true : false}
      style={styles.container}
      onPress={handleOnPress}>
      {name === 'invite' ? (
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={shareCode}>
            <ShareIcon style={ICON_SIZE} />
          </Pressable>
          <Pressable onPress={copyToClipboard}>
            <Copy style={{ ...ICON_SIZE, marginLeft: rw(2) }} />
          </Pressable>
        </View>
      ) : null}

      {name !== 'exit' && name !== 'invite' ? (
        <View>
          {isFetching ? (
            <ActivityIndicator size="small" color={COLORS.textLight} />
          ) : (
            <NextPage style={ICON_SIZE} />
          )}
        </View>
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
          bold
          size={10.5}
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
          Icon()
        )}
      </View>
    </Pressable>
  );
};

export default SettingOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: rw(79),
    marginTop: rh(1.2),
    marginVertical: rh(0.5),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(0),
  },
});
