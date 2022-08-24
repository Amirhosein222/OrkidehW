/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import moment from 'moment-jalaali';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Text } from '../common';
import { COLORS, rh, rw } from '../../configs';
import {
  convertToFullDate,
  getFromAsyncStorage,
  numberConverter,
} from '../../libs/helpers';
import ReadMore from '@fawazahmed/react-native-read-more';

const Comment = ({ comment }) => {
  const [info, setInfo] = useState(null);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: rw(75),
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
      paddingRight: rw(3),
      borderRightWidth: 2.5,
      borderRightColor: COLORS.textLight,
      width: '100%',
      alignItems: 'flex-end',
      marginRight: rw(2),
    },
    textStyle: {
      fontSize: 13,
    },
    moreLess: {
      color: COLORS.textLight,
      fontFamily: 'Qs_Iranyekan_bold',
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
      marginRight: rw(3),
    },
    separator: {
      width: rw(70),
      borderBottomWidth: 2,
      borderBottomColor: COLORS.textLight,
      marginVertical: rh(2),
    },
    avatarBorderdContainer: {
      backgroundColor: COLORS.inputTabBarBg,
      width: 50,
      height: 50,
      borderRadius: 55,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
    },
  });

  useEffect(() => {
    getFromAsyncStorage('fullInfo').then((res) => {
      if (res) {
        setInfo(JSON.parse(res));
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.nameContainer}>
          <View style={{ alignItems: 'flex-end', marginRight: rw(2) }}>
            <Text small color={COLORS.textDark}>
              {comment.hasOwnProperty('user')
                ? comment.user.display_name
                : 'نگار قاسمی'}
            </Text>
            <Text alignSelf="flex-end" small color={COLORS.textLight}>
              {numberConverter(convertToFullDate(comment.created_at))}
            </Text>
          </View>

          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: 60,
              height: 60,
            }}>
            <View style={styles.avatarBorderdContainer}>
              <FontAwesome5 name="user" size={25} color={COLORS.icon} />
            </View>
          </View>
          <MaterialCommunityIcons
            name="subdirectory-arrow-left"
            size={22}
            color={COLORS.icon}
          />
        </View>
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={styles.root}>
          <ReadMore
            numberOfLines={3}
            seeMoreText="بیشتر بخوانید ..."
            seeMoreStyle={styles.moreLess}
            seeLessStyle={styles.moreLess}
            wrapperStyle={{ flexDirection: 'column' }}
            ellipsis="..."
            style={{
              color: COLORS.textCommentCal,
              fontFamily: 'Qs_Iranyekan_bold',
              textAlign: 'right',
              fontSize: 12,
            }}
            seeLessText="بستن">
            {numberConverter(comment.text)}
          </ReadMore>
        </View>
      </SafeAreaView>
      <View style={styles.separator} />
    </View>
  );
};

export default Comment;
