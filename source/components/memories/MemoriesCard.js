/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Comment from './Comment';
import { Text, ReadMore } from '../common';
import { COLORS, rh, rw } from '../../configs';
import {
  convertToFullDate,
  getFromAsyncStorage,
  numberConverter,
} from '../../libs/helpers';

import DelIcon from '../../assets/icons/btns/delete.svg';
import EnEdit from '../../assets/icons/btns/enabled-edit.svg';
import EnSend from '../../assets/icons/btns/enabled-send.svg';
import CmIcon from '../../assets/icons/btns/comment.svg';
import Avatar from '../../assets/vectors/profile/woman-1.png';
import { ICON_SIZE } from '../../configs/styles';

const MemoriesCard = ({
  memory = null,
  myMemory = false,
  handleEdit,
  handleDelete,
  handleReportModal,
}) => {
  const [liked, setLiked] = useState({ id: null, liked: false });
  const [info, setInfo] = useState(null);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: rw(90),
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      alignSelf: 'center',
      backgroundColor: COLORS.mainBg,
      elevation: 3,
      overflow: 'hidden',
      borderRadius: 20,
    },
    topHeader: {
      flexDirection: 'row',
      width: '100%',
      alignSelf: 'center',
      paddingVertical: rh(2),
    },
    bottomFooter: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginVertical: rh(1),
      paddingHorizontal: rw(2),
      height: rh(4),
    },
    safe: {
      flex: 1,
    },
    root: {
      flex: 1,
      paddingRight: rw(3),
      borderRightWidth: 2.5,
      borderRightColor: COLORS.textLight,
      width: rw(85),
      alignItems: 'flex-end',
      marginRight: rw(2),
    },
    textStyle: {
      fontSize: 13,
    },
    moreLess: {
      color: COLORS.textLight,
      fontFamily: 'IRANYekanXFaNum-Regular',
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    label: {
      width: 150,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        myMemory === false
          ? '#fcfcff'
          : memory.is_accepted === 1
          ? '#00e262'
          : memory.is_accepted === 2
          ? 'orange'
          : 'red',
      transform: [{ rotate: '-50deg' }],
      height: 25,
      borderTopRightRadius: 3,
      borderBottomRightRadius: 3,
      ...StyleSheet.absoluteFillObject,
      top: 10,
      left: -40,
    },
    editDeleteContainer: {
      flexDirection: 'row',
      marginLeft: rw(3),
      marginTop: rh(2),
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
      marginRight: rw(3),
    },
    separator: {
      width: rw(70),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.textLight,
      marginVertical: rh(2),
    },
    cmInput: {
      backgroundColor: COLORS.inputTabBarBg,
      height: rh(7),
      width: rw(70),
      borderRadius: 10,
      color: COLORS.textLight,
      fontFamily: 'IRANYekanXFaNum-Regular',
      textAlign: 'right',
      textAlignVertical: 'top',
      fontSize: 11,
    },
    cmInputContainer: {
      flexDirection: 'row',
      width: '90%',
      alignSelf: 'center',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: rh(2),
    },
    avatarBorderdContainer: {
      backgroundColor: COLORS.inputTabBarBg,
      width: 70,
      height: 70,
      borderRadius: 55,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
    },
  });

  const handleLike = function (mId) {
    setLiked({ id: mId, liked: !liked.liked });
    if (!liked.liked) {
      memory.like = memory.like + 1;
    } else {
      memory.like = memory.like - 1;
    }
  };

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
        {myMemory === true ? (
          <View style={styles.editDeleteContainer}>
            <Pressable onPress={() => handleDelete(memory.id)}>
              <DelIcon style={ICON_SIZE} />
            </Pressable>
            <Pressable hitSlop={5} onPress={() => handleEdit(memory)}>
              <EnEdit style={ICON_SIZE} />
            </Pressable>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.nameContainer}>
          {myMemory && info ? (
            <View style={{ marginRight: rw(1) }}>
              <Text small alignSelf="flex-end" color={COLORS.textDark} bold>
                {info.display_name}
              </Text>
              <Text
                alignSelf="flex-end"
                marginRight={rw(0.6)}
                mini
                bold
                color={COLORS.textLight}>
                {convertToFullDate(memory.created_at)}
              </Text>
            </View>
          ) : (
            <View style={{ marginRight: rw(1) }}>
              <Text small color={COLORS.textDark} bold>
                {memory.hasOwnProperty('user')
                  ? memory.user.display_name
                  : 'نگار قاسمی'}
              </Text>
              <Text
                alignSelf="flex-end"
                marginRight={rw(0.6)}
                mini
                color={COLORS.textLight}>
                {convertToFullDate(memory.created_at)}
              </Text>
            </View>
          )}
          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: 80,
              height: 80,
            }}>
            <View style={styles.avatarBorderdContainer}>
              <Image style={{ width: rw(13), height: rh(7) }} source={Avatar} />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.root}>
        <ReadMore>{memory.text}</ReadMore>
      </View>
      <View style={styles.separator} />
      {/* Comments Section */}
      {/* <Comment comment={memory} /> */}
      <View style={styles.cmInputContainer}>
        <EnSend style={ICON_SIZE} />
        <TextInput
          placeholder="نظر خود را اینجا وارد کنید"
          placeholderTextColor={COLORS.textLight}
          style={styles.cmInput}
          returnKeyType="next"
          multiline
        />
      </View>

      <View style={styles.bottomFooter}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '95%',
          }}>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Pressable
              onPress={() => handleLike(memory)}
              style={{ margin: 0, justifyContent: 'center' }}>
              <Icon
                name="hearto"
                size={18}
                color={liked.liked ? COLORS.primary : COLORS.icon}
              />
            </Pressable>
            <Text style={{ marginLeft: 5 }} color={COLORS.textLight}>
              {numberConverter(memory.like)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              marginLeft: rw(5),
              marginRight: myMemory ? 'auto' : 0,
            }}>
            <Pressable style={{ margin: 0, justifyContent: 'center' }}>
              <CmIcon style={{ width: 20, height: 20 }} />
            </Pressable>
            <Text style={{ marginLeft: 5 }} color={COLORS.textLight}>
              {numberConverter(0)}
            </Text>
          </View>
          {!myMemory && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                marginRight: 'auto',
                marginLeft: rw(4),
              }}>
              <Pressable
                onPress={handleReportModal}
                style={{ margin: 0, justifyContent: 'center' }}>
                <MaterialCommunityIcons
                  name="shield-alert-outline"
                  size={18}
                  color={COLORS.icon}
                />
              </Pressable>
            </View>
          )}

          <Text bold mini style={{ marginLeft: 10 }} color={COLORS.textLight}>
            10 روز پیش
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MemoriesCard;
