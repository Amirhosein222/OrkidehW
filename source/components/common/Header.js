/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CalendarModal from '../calendar/CalendarModal';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { COLORS, rh, rw } from '../../configs';
import { showSnackbar } from '../../libs/helpers';

import CalendarIcon from '../../assets/icons/home/calendar.svg';
import MenuIcon from '../../assets/icons/home/menu.svg';

const Header = ({ navigation, style }) => {
  const { isPeriodDay } = useContext(WomanInfoContext);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const onSendLove = () => {
    showSnackbar('با موفقیت ارسال شد', 'success');
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
              size={30}
              color={COLORS.white}
            />
          </Pressable>
          {/* <Pressable
            onPress={() => setShowCalendarModal(true)}
            style={{
              ...styles.sendLoveContainer,
              marginLeft: rw(2),
            }}>
            <CalendarIcon style={{ width: 25, height: 25 }} />
          </Pressable> */}
        </View>

        <Pressable onPress={() => navigation.openDrawer()}>
          <MenuIcon style={{ width: 25, height: 25, marginRight: rw(4) }} />
        </Pressable>
        {showCalendarModal && (
          <CalendarModal
            visible={showCalendarModal}
            closeModal={() => setShowCalendarModal(false)}
          />
        )}
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
    width: rw(12.3),
    height: rh(5.9),
    borderRadius: 35,
  },
});

export default Header;
