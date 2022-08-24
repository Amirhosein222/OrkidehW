/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../../../../components/common';
import { baseUrl, COLORS, rh, rw } from '../../../../configs';
import { convertToFullDate, numberConverter } from '../../../../libs/helpers';

const RelItem = ({
  rel,
  handleShowDeleteModal,
  updateRels,
  handleVerifyRel,
  isVerifying = false,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.avatarContainer}>
      <View style={{ alignSelf: 'flex-start' }}>
        <View style={styles.editDeleteContainer}>
          <Pressable onPress={() => handleShowDeleteModal(rel.id)} hitSlop={7}>
            <Image
              source={require('../../../../assets/icons/btns/delete.png')}
              style={{ width: 25, height: 25 }}
            />
          </Pressable>
          <Pressable
            hitSlop={7}
            onPress={() =>
              navigation.navigate('UpdateRel', {
                rel: rel,
                handleUpdateRels: updateRels,
              })
            }>
            <Image
              source={require('../../../../assets/icons/btns/enabled-edit.png')}
              style={{ width: 25, height: 25 }}
            />
          </Pressable>
        </View>
        {!rel.is_verified && (
          <Pressable
            disabled={isVerifying}
            onPress={() => handleVerifyRel(rel.verification_code)}
            style={styles.verifyRel}>
            {isVerifying ? (
              <ActivityIndicator size="small" color={COLORS.borderLinkBtn} />
            ) : (
              <Text small color={COLORS.borderLinkBtn} textAlign="right">
                تایید رابطه
              </Text>
            )}
          </Pressable>
        )}
      </View>
      <View style={styles.avatarNameContainer}>
        <View style={styles.nameContainer}>
          <Text
            medium
            color={COLORS.textDark}
            textAlign="right"
            alignSelf="flex-end">
            {rel.man_name}
          </Text>
          <Text color={COLORS.textLight} alignSelf="flex-end">
            {numberConverter(convertToFullDate(rel.man.birth_date))}
          </Text>
        </View>

        {rel.man_image ? (
          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: 110,
              height: 110,
            }}>
            <Image
              source={{ uri: baseUrl + rel.man_image }}
              style={{ width: 100, height: 100, borderRadius: 70 }}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: 100,
              height: 100,
            }}>
            <View style={styles.avatarBorderdContainer}>
              <Fontisto name="male" size={55} color={COLORS.textDark} />
            </View>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(1),
  },
  avatarNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorderdContainer: {
    backgroundColor: COLORS.inputTabBarBg,
    width: 90,
    height: 90,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  nameContainer: {
    marginRight: rw(2),
  },
  editDeleteContainer: {
    flexDirection: 'row',
    marginLeft: rw(0.5),
    marginTop: rh(4),
  },
  verifyRel: {
    alignSelf: 'flex-end',
    width: rw(18),
    borderColor: COLORS.borderLinkBtn,
    borderWidth: 1,
    borderRadius: 4,
    height: rh(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(1.5),
  },
});

export default RelItem;
