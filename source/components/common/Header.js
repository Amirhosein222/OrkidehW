/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Text } from './index';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { COLORS, rh, rw } from '../../configs';
import { Snackbar } from '../../components/common';
import { showSnackbar } from '../../libs/helpers';

const Header = ({ navigation, style }) => {
  const { isPeriodDay } = useContext(WomanInfoContext);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const onSendLove = () => {
    // setSnackbar({
    //   msg: 'با موفقیت ارسال شد',
    //   visible: true,
    //   type: 'success',
    // });
    showSnackbar('با موفقیت ارسال شد', 'success');
  };

  // const handleVisible = () => {
  //   setSnackbar({
  //     visible: !snackbar.visible,
  //   });
  // };

  return (
    <View style={[styles.container, { ...style }]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={onSendLove}
          style={{
            ...styles.sendLoveContainer,
            backgroundColor: isPeriodDay ? COLORS.rossoCorsa : COLORS.pink,
          }}>
          <MaterialCommunityIcons name="heart" size={28} color={COLORS.white} />
          <Text textAlign="center" color="white" mini marginRight={rw(1)}>
            ارسال علاقه مندی به همسر
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Symptoms')}
          style={{
            ...styles.sendLoveContainer,
            backgroundColor: isPeriodDay ? COLORS.rossoCorsa : COLORS.pink,
          }}>
          <Ionicons
            name="ios-person-add"
            size={28}
            color={COLORS.white}
            style={{ marginLeft: rw(1) }}
          />
          <Text textAlign="center" color="white" mini marginRight={rw(1)}>
            مشاهده انتظارات همسر
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={() => navigation.openDrawer()}>
        <MaterialCommunityIcons
          name="menu"
          color={COLORS.grey}
          size={28}
          style={{ marginRight: 20 }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    width: '100%',
    margin: 20,
    height: 50,
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
    flexShrink: 1,
    width: rw(35),
    paddingHorizontal: rw(2),
    paddingVertical: rh(0.5),
    borderRadius: 35,
    marginLeft: rw(4),
    elevation: 3,
  },
});

export default Header;
