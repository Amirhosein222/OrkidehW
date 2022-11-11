/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { COLORS, rh, rw } from '../../configs';

import MenuIcon from '../../assets/icons/home/menu.svg';
import { useApi } from '../../libs/hooks';
import { sendLoveNotifApi } from '../../libs/apiCalls';
import Text from './Text';

const Header = ({ navigation, style, setShowLovePopup, setSnackbar, ads }) => {
  const { activeRel, isPeriodDay } = useContext(WomanInfoContext);
  const [sendLove, setSendLove] = useApi(() =>
    sendLoveNotifApi(activeRel.relId),
  );

  const onSendLove = () => {
    if (!activeRel) {
      return setSnackbar({
        msg: 'شما هیچ رابطه فعالی ندارید!',
        visible: true,
      });
    }
    setSendLove();
  };

  useEffect(() => {
    if (sendLove.data === 200 && sendLove.isSuccess) {
      setShowLovePopup(true);
    }
    if (sendLove.isSuccess && sendLove.data !== 200) {
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
    }
  }, [sendLove]);

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
              backgroundColor:
                activeRel && isPeriodDay
                  ? COLORS.fireEngineRed
                  : activeRel && !isPeriodDay
                  ? COLORS.primary
                  : '',
            }}>
            {sendLove.isFetching ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialCommunityIcons
                name="heart-outline"
                size={27}
                color={activeRel ? COLORS.white : COLORS.icon}
              />
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.openDrawer()}>
          <MenuIcon style={{ width: 25, height: 25, marginRight: rw(4) }} />
        </Pressable>
      </View>
      <Text size={12} bold color="rgba(190,160,190, 0.6)">
        {ads}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: rh(8),
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
