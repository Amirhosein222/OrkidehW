/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { Image, StyleSheet, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../../../../components/common';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';
import { COLORS, ICON_SIZE, rh, rw } from '../../../../configs';

import womanIcon from '../../../../assets/vectors/profile/woman-1.png';
import NextPage from '../../../../assets/icons/drawerSettings/nextPage.svg';
// import EnabledEdit from '../../../../assets/btns/enabled-edit.s'

const UserAvatarInfo = ({ profile = false, openPicker = null, picture }) => {
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
              medium
              bold
              color={COLORS.textDark}
              textAlign="right"
              alignSelf="flex-end">
              {womanInfo.fullInfo.display_name}
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
          width: 110,
          height: 110,
        }}>
        {picture ? (
          <Image
            source={{ uri: picture }}
            style={{ width: 100, height: 100, borderRadius: 70 }}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.avatarBorderdContainer}>
            <Image
              source={womanIcon}
              style={{ width: 90, height: 90, borderRadius: 70 }}
              resizeMode="contain"
            />
          </View>
        )}

        {profile && (
          <Pressable
            style={styles.plusIconContainer}
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
    height: rh(15.5),
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
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  nameContainer: {
    paddingRight: rw(3),
  },
  plusIconContainer: {
    width: rw(9.5),
    height: rh(4.5),
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    top: rh(9),
  },
});

export default UserAvatarInfo;
