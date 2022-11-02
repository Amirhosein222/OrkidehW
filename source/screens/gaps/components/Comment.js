/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text, ReadMore } from '../../../components/common';
import { COLORS, rh, rw } from '../../../configs';
import { convertToFullDate, numberConverter } from '../../../libs/helpers';

import Avatar from '../../../assets/vectors/profile/woman-1.png';

const Comment = ({ comment }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: rw(81),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: COLORS.mainBg,
      overflow: 'hidden',
    },
    topHeader: {
      flexDirection: 'row',
      width: '100%',
      alignSelf: 'center',
      paddingVertical: rh(2),
    },
    safe: {
      flex: 1,
    },
    root: {
      flex: 1,
      paddingRight: rw(0),
      borderRightWidth: 1.8,
      borderRightColor: COLORS.textLight,
      width: '95%',
      alignItems: 'flex-end',
      marginRight: rw(5),
    },
    textStyle: {
      fontSize: 13,
    },
    moreLess: {
      color: COLORS.textLight,
      fontFamily: 'IRANYekanMobileBold',
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    separator: {
      width: rw(70),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.textLight,
      marginVertical: rh(2),
    },
    avatarBorderdContainer: {
      backgroundColor: COLORS.inputTabBarBg,
      width: rw(10.4),
      height: rh(4.7),
      borderRadius: 55,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
      overflow: 'hidden',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.nameContainer}>
          <View style={{ alignItems: 'flex-end', marginRight: rw(2) }}>
            <Text alignSelf="flex-end" size={8.5} bold color={COLORS.textDark}>
              {comment.hasOwnProperty('user')
                ? comment.user.display_name
                : 'نگار قاسمی'}
            </Text>
            <Text
              size={7.5}
              alignSelf="flex-end"
              mini
              bold
              color={COLORS.textLight}>
              {numberConverter(convertToFullDate(comment.created_at))}
            </Text>
          </View>

          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: rw(12.2),
              height: rh(5.8),
            }}>
            <View style={styles.avatarBorderdContainer}>
              <Image
                style={{ width: rw(8.5), height: rh(3.3) }}
                source={Avatar}
              />
            </View>
          </View>
          <MaterialCommunityIcons
            name="subdirectory-arrow-left"
            size={22}
            color={COLORS.icon}
          />
        </View>
      </View>

      <View style={styles.root}>
        <ReadMore textStyle={{ fontSize: 11 }}>{comment.text}</ReadMore>
      </View>
      <View style={styles.separator} />
    </View>
  );
};

export default Comment;
