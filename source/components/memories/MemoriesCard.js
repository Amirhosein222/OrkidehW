/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Comment from './Comment';
import { Text } from '../common';
import { COLORS, rh, rw } from '../../configs';
import {
  convertToFullDate,
  getFromAsyncStorage,
  numberConverter,
} from '../../libs/helpers';
import ReadMore from '@fawazahmed/react-native-read-more';

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
      fontFamily: 'Qs_Iranyekan_bold',
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
      borderBottomWidth: 2,
      borderBottomColor: COLORS.textLight,
      marginVertical: rh(2),
    },
    cmInput: {
      backgroundColor: COLORS.inputTabBarBg,
      height: rh(7),
      width: rw(70),
      borderRadius: 10,
      color: COLORS.textLight,
      fontFamily: 'Qs_Iranyekan_bold',
      textAlign: 'right',
      textAlignVertical: 'top',
      fontSize: 14,
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
              <Image
                source={require('../../assets/icons/btns/delete.png')}
                style={{ width: 25, height: 25 }}
              />
            </Pressable>
            <Pressable hitSlop={5} onPress={() => handleEdit(memory)}>
              <Image
                source={require('../../assets/icons/btns/enabled-edit.png')}
                style={{ width: 25, height: 25 }}
              />
            </Pressable>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.nameContainer}>
          {myMemory && info ? (
            <View style={{ marginRight: rw(1) }}>
              <Text
                marginRight="10"
                alignSelf="flex-end"
                color={COLORS.textDark}>
                {info.display_name}
              </Text>
              <Text
                alignSelf="flex-end"
                marginRight="10"
                color={COLORS.textLight}>
                {numberConverter(convertToFullDate(memory.created_at))}
              </Text>
            </View>
          ) : (
            <View style={{ marginRight: rw(1) }}>
              <Text>
                {memory.hasOwnProperty('user')
                  ? memory.user.display_name
                  : 'نگار قاسمی'}
              </Text>
              <Text alignSelf="flex-end" marginRight="10">
                {numberConverter(convertToFullDate(memory.created_at))}
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
              <FontAwesome5 name="user" size={25} color={COLORS.icon} />
            </View>
          </View>
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
            }}
            seeLessText="بستن">
            {numberConverter(memory.text)}
          </ReadMore>
        </View>
      </SafeAreaView>
      <View style={styles.separator} />
      {/* Comments Section */}
      {/* <Comment comment={memory} /> */}
      <View style={styles.cmInputContainer}>
        <Image
          source={require('../../assets/icons/btns/enabled-send.png')}
          style={{ width: 28, height: 28 }}
        />
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
                size={20}
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
              <Image
                source={require('../../assets/icons/btns/comment.png')}
                style={{ width: 20, height: 20 }}
              />
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
                  size={20}
                  color={COLORS.icon}
                />
              </Pressable>
            </View>
          )}

          <Text small style={{ marginLeft: 10 }} color={COLORS.textLight}>
            10 روز پیش
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MemoriesCard;
