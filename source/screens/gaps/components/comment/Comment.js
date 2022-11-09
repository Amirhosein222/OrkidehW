/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text, ReadMore } from '../../../../components/common';
import { styles } from './styles';
import { COLORS, rh, rw } from '../../../../configs';
import { convertToFullDate, numberConverter } from '../../../../libs/helpers';

import Avatar from '../../../../assets/vectors/profile/woman-1.png';

const children_recursive = [
  {
    id: 2,
    user_id: 139,
    user_type: '\\Modules\\Ghaedegi\\Entities\\GhaedeWoman',
    post_id: 46,
    post_type: 'Modules\\Ghaedegi\\Entities\\GhaedeMemory',
    parent_id: 1,
    comment_text: 'aslannnnnn',
    is_verified: 1,
    created_at: 1667974857,
    updated_at: 1667988548,
    user_name: 'Name',
    children_recursive: [],
  },
];

const RecursiveCm = ({ cm }) => {
  return (
    <View style={{ ...styles.container, width: '90%' }}>
      <View style={{ ...styles.topHeader, marginRight: rw(2) }}>
        <View style={styles.nameContainer}>
          <View style={{ alignItems: 'flex-end', marginRight: rw(2) }}>
            <Text alignSelf="flex-end" size={8.5} bold color={COLORS.textDark}>
              {cm.hasOwnProperty('user') ? cm.user.display_name : 'نگار قاسمی'}
            </Text>
            <Text
              size={7.5}
              alignSelf="flex-end"
              mini
              bold
              color={COLORS.textLight}>
              {numberConverter(convertToFullDate(cm.created_at))}
            </Text>
          </View>

          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: rw(12),
              height: rh(5.6),
            }}>
            <View style={styles.avatarBorderdContainer}>
              <Image style={{ width: rw(8), height: rh(3) }} source={Avatar} />
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
        <ReadMore textStyle={{ fontSize: 11 }}>{cm.comment_text}</ReadMore>
      </View>
      <View style={styles.separator} />
    </View>
  );
};

const Comment = ({ comment }) => {
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
        <ReadMore textStyle={{ fontSize: 11 }}>{comment.comment_text}</ReadMore>
      </View>
      <View style={styles.separator} />
      {comment.children_recursive.length
        ? comment.children_recursive.map(cm => <RecursiveCm cm={cm} />)
        : null}
    </View>
  );
};

export default Comment;
