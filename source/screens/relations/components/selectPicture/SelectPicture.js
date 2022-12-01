/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Image, View, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { COLORS, rh, rw } from '../../../../configs';
import { useIsPeriodDay } from '../../../../libs/hooks';

import manIcon from '../../../../assets/vectors/profile/man-1.png';

const SelectPicture = ({ picture, setShowPictureModal, isUpdate = false }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <View
      style={{
        ...styles.avatarBorderdContainer,
        width: 140,
        height: 140,
        borderRadius: 140,
        marginTop: rh(2),
      }}>
      {picture ? (
        <Image
          source={{ uri: picture }}
          style={{ width: 130, height: 130, borderRadius: 130 }}
        />
      ) : (
        <View style={styles.avatarBorderdContainer}>
          {isUpdate ? (
            <Image
              source={manIcon}
              style={{ width: 115, height: 115, borderRadius: 115 }}
            />
          ) : (
            <FontAwesome5 name="camera" size={65} color={COLORS.textLight} />
          )}
        </View>
      )}

      <Pressable
        style={{
          ...styles.plusIconContainer,
          backgroundColor: isPeriodDay ? COLORS.periodDay : COLORS.primary,
        }}
        hitSlop={7}
        onPress={() => setShowPictureModal(true)}>
        <FontAwesome5 name="plus" size={20} color={COLORS.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarBorderdContainer: {
    backgroundColor: COLORS.inputTabBarBg,
    width: 125,
    height: 125,
    borderRadius: 125 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'white',
    // overflow: 'hidden',
  },
  plusIconContainer: {
    width: rw(10.2),
    height: rh(5),
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    top: rh(11.5),
  },
});

export default SelectPicture;
