/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { Image, StyleSheet, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../../../../components/common';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';
import { COLORS, ICON_SIZE, rh, rw } from '../../../../configs';
import { useIsPeriodDay } from '../../../../libs/hooks';

import womanIcon from '../../../../assets/vectors/profile/woman-1.png';
import NextPage from '../../../../assets/icons/drawerSettings/nextPage.svg';
// import EnabledEdit from '../../../../assets/btns/enabled-edit.s'

const UserAvatarInfo = ({ profile = false, openPicker = null, picture }) => {
  const isPeriodDay = useIsPeriodDay();

  const womanInfo = useContext(WomanInfoContext);
  const navigation = useNavigation();

  return (
    <View
      style={{
        ...styles.avatarContainer,
        justifyContent: profile ? 'center' : 'flex-end',
      }}>
      {!profile && (
        <>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={{ marginTop: rh(0.5), marginRight: 'auto' }}>
            <NextPage style={ICON_SIZE} />
          </Pressable>
          <View style={styles.nameContainer}>
            <Text
              bold
              size={14}
              color={COLORS.textDark}
              textAlign="right"
              alignSelf="flex-end">
              {womanInfo.fullInfo.name}
            </Text>
            <Text bold color={COLORS.textLight} alignSelf="flex-end">
              {womanInfo.fullInfo.mobile}
            </Text>
          </View>
        </>
      )}

      <View
        style={{
          ...styles.avatarBorderdContainer,
          width: profile ? 140 : 100,
          height: profile ? 140 : 100,
          borderRadius: profile ? 140 : 100,
        }}>
        {picture ? (
          <Image
            source={{ uri: picture }}
            style={{
              width: profile ? 130 : 90,
              height: profile ? 130 : 90,
              borderRadius: 130,
            }}
            resizeMode="contain"
          />
        ) : (
          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: profile ? 130 : 90,
              height: profile ? 130 : 90,
              borderRadius: profile ? 130 : 90,
            }}>
            <Image
              source={womanIcon}
              style={{ width: profile ? 110 : 70, height: profile ? 110 : 70 }}
              resizeMode="contain"
            />
          </View>
        )}

        {profile && (
          <Pressable
            style={{
              ...styles.plusIconContainer,
              backgroundColor: isPeriodDay
                ? COLORS.fireEngineRed
                : COLORS.primary,
            }}
            hitSlop={7}
            onPress={openPicker}>
            <Icon name="plus" size={20} color={COLORS.white} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    width: rw(83),
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: rw(1),
  },
  avatarBorderdContainer: {
    backgroundColor: COLORS.inputTabBarBg,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'white',
  },
  avatarDefaultBorderd: {
    backgroundColor: COLORS.inputTabBarBg,
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  avatarDefault: { width: 70, height: 70 },
  nameContainer: {
    paddingRight: rw(3),
  },
  plusIconContainer: {
    width: rw(10.1),
    height: rh(5),
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    top: rh(11.5),
  },
});

export default UserAvatarInfo;
