/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { COLORS, rh, rw } from '../../configs';

import MenuIcon from '../../assets/icons/home/menu.svg';

const Header = ({ navigation, style, setShowLovePopup }) => {
  const { isPeriodDay, settings } = useContext(WomanInfoContext);

  const onSendLove = () => {
    // settings.app_heart_content_notification.value -> send it to api.
    setShowLovePopup(true);
  };

  return (
    <View style={[styles.container, { ...style }]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          width: rw(100),
          paddingHorizontal: rw(4),
        }}>
        <View style={{ flexDirection: 'row', marginLeft: rw(4) }}>
          <Pressable
            onPress={onSendLove}
            style={{
              ...styles.sendLoveContainer,
              backgroundColor: isPeriodDay
                ? COLORS.fireEngineRed
                : COLORS.primary,
            }}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={26}
              color={COLORS.white}
            />
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.openDrawer()}>
          <MenuIcon style={{ width: 25, height: 25, marginRight: rw(4) }} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: rh(2),
    height: 50,
    backgroundColor: 'transparent',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    width: '45%',
    height: 40,
    borderRadius: 20,
  },
  sendLoveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },
});

export default Header;
