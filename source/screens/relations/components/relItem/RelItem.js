/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../../../../components/common';
import { baseUrl, COLORS, ICON_SIZE, rh, rw } from '../../../../configs';

import manIcon from '../../../../assets/vectors/profile/man-1.png';
import Delete from '../../../../assets/icons/btns/delete.svg';
import EnabledEdit from '../../../../assets/icons/btns/enabled-edit.svg';

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
          <Pressable
            onPress={() => handleShowDeleteModal(rel.value)}
            hitSlop={7}>
            <Delete style={ICON_SIZE} />
          </Pressable>
          <Pressable
            hitSlop={7}
            onPress={() =>
              navigation.navigate('UpdateRel', {
                rel: rel,
                handleUpdateRels: updateRels,
              })
            }>
            <EnabledEdit style={ICON_SIZE} />
          </Pressable>
        </View>
        <Pressable
          disabled={rel.applicant === 'woman' || isVerifying || rel.is_verified}
          onPress={() => handleVerifyRel(rel.verifyCode)}
          style={styles.verifyRel}>
          {isVerifying ? (
            <ActivityIndicator size="small" color={COLORS.borderLinkBtn} />
          ) : (
            <Text size={9} color={COLORS.borderLinkBtn} textAlign="right">
              {!rel.is_verified && rel.applicant === 'man'
                ? 'تایید رابطه'
                : !rel.is_verified && rel.applicant === 'woman'
                ? 'در انتظار تایید'
                : 'تایید شده'}
            </Text>
          )}
        </Pressable>
      </View>
      <View style={styles.avatarNameContainer}>
        <View style={styles.nameContainer}>
          <Text
            size={14}
            bold
            color={COLORS.textDark}
            textAlign="right"
            alignSelf="flex-end">
            {rel.label}
          </Text>
          <Text size={12} bold color={COLORS.textLight} alignSelf="flex-end">
            {rel.mobile}
          </Text>
        </View>

        {rel.image ? (
          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: 110,
              height: 110,
            }}>
            <Image
              source={{ uri: baseUrl + rel.image }}
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
              <Image
                source={manIcon}
                style={{ width: 80, height: 80, borderRadius: 70 }}
                resizeMode="contain"
              />
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
    overflow: 'hidden',
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
