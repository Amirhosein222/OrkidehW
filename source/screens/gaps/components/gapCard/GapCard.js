/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Pressable, TextInput, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Comment from '../comment';
import { Text, ReadMore } from '../../../../components/common';
import { COLORS, rh, rw } from '../../../../configs';
import { addCommentApi } from '../../../../libs/apiCalls';
import { convertToFullDate, numberConverter } from '../../../../libs/helpers';
import { useApi } from '../../../../libs/hooks';

import calcDiffDays from '../../helpers/calcDiffDays';
import { ICON_SIZE } from '../../../../configs/styles';
import { ActivityIndicator } from 'react-native-paper';
import { likeGapApi, getCommentsApi } from '../../apis';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';

import DelIcon from '../../../../assets/icons/btns/delete.svg';
import EnEdit from '../../../../assets/icons/btns/enabled-edit.svg';
import EnSend from '../../../../assets/icons/btns/enabled-send.svg';
import DsSend from '../../../../assets/icons/btns/disabled-send.svg';
import CmIcon from '../../../../assets/icons/btns/comment.svg';
import Avatar from '../../../../assets/vectors/profile/woman-1.png';
import DLike from '../../../../assets/icons/btns/disabled-like.svg';
import ELike from '../../../../assets/icons/btns/enabled-like.svg';

const GapCard = ({
  memory = null,
  myMemory = false,
  handleEdit,
  handleDelete,
  handleReportModal,
  updateGaps,
}) => {
  const { fullInfo } = useContext(WomanInfoContext);
  const [liked, setLiked] = useState();

  const [comment, setComment] = useState('');
  const [sendCM, setSendCm] = useApi(() =>
    addCommentApi('', memory.id, 'memory', comment),
  );
  const [likeGap, setLikeGap] = useApi(() => likeGapApi(memory.id));
  const [comments, setComments] = useApi(() => getCommentsApi(memory.id));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: rw(88),
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      alignSelf: 'center',
      backgroundColor: COLORS.mainBg,
      elevation: 3,
      overflow: 'hidden',
      borderRadius: 22,
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
      paddingRight: rw(1),
      borderRightWidth: 2.5,
      borderRightColor: COLORS.textLight,
      width: rw(85),
      alignItems: 'flex-end',
      marginRight: rw(4),
    },
    textStyle: {
      fontSize: 13,
    },
    moreLess: {
      color: COLORS.textLight,
      fontFamily: 'IRANYekanMobileRegular',
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
      marginTop: rh(2),
    },
    cmInput: {
      backgroundColor: COLORS.inputTabBarBg,
      height: rh(5.5),
      width: rw(70),
      borderRadius: 10,
      color: COLORS.textLight,
      fontFamily: 'IRANYekanMobileRegular',
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
      width: rw(15.4),
      height: rh(7.5),
      borderRadius: 55,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
      overflow: 'hidden',
    },
  });

  const onSendComment = () => {
    setSendCm();
  };

  const onLike = () => {
    setLiked(!liked);
    setLikeGap();
  };

  useEffect(() => {
    setComments();
    setLiked(
      likeGap.data && likeGap.data.data.my_like
        ? true
        : memory.my_like
        ? true
        : false,
    );

    return () => {
      setLiked();
    };
  }, []);

  useEffect(() => {
    if (sendCM.data && sendCM.data.is_successful) {
      setComment('');
      updateGaps();
    }
  }, [sendCM]);

  useEffect(() => {
    if (comments.data && comments.data.is_successful) {
    }
  }, [comments]);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        {myMemory ? (
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
          {myMemory && fullInfo ? (
            <View style={{ marginRight: rw(1) }}>
              <Text size={11} alignSelf="flex-end" color={COLORS.textDark} bold>
                {fullInfo.display_name}
              </Text>
              <Text
                alignSelf="flex-end"
                marginRight={rw(0.6)}
                size={10}
                bold
                color={COLORS.textLight}>
                {convertToFullDate(memory.created_at)}
              </Text>
            </View>
          ) : (
            <View style={{ marginRight: rw(1) }}>
              <Text alignSelf="flex-end" size={11} color={COLORS.textDark} bold>
                {memory.hasOwnProperty('user')
                  ? memory.user.display_name
                  : 'نگار قاسمی'}
              </Text>
              <Text
                alignSelf="flex-end"
                marginRight={rw(0.6)}
                size={10}
                bold
                color={COLORS.textLight}>
                {convertToFullDate(memory.created_at)}
              </Text>
            </View>
          )}
          <View
            style={{
              ...styles.avatarBorderdContainer,
              width: rw(17.8),
              height: rh(8.7),
            }}>
            <View style={styles.avatarBorderdContainer}>
              <Image
                style={{ width: rw(12.3), height: rh(6) }}
                source={Avatar}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.root}>
        <ReadMore>{memory.text}</ReadMore>
      </View>
      <View style={styles.separator} />
      {/* Comments Section */}
      {comments.data && comments.data.data.length
        ? comments.data.data.map(cm => <Comment comment={cm} />)
        : null}
      {!myMemory ? (
        <View style={styles.cmInputContainer}>
          <TextInput
            placeholder="نظر خود را اینجا وارد کنید"
            placeholderTextColor={COLORS.textLight}
            style={styles.cmInput}
            onChangeText={setComment}
            returnKeyType="next"
            multiline
          />
          <Pressable
            disabled={sendCM.isFetching || !comment}
            onPress={onSendComment}>
            {sendCM.isFetching ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                {comment ? (
                  <EnSend
                    style={{
                      ...ICON_SIZE,
                      alignSelf: 'flex-end',
                      marginBottom: rh(0.3),
                    }}
                  />
                ) : (
                  <DsSend
                    style={{
                      ...ICON_SIZE,
                      alignSelf: 'flex-end',
                      marginBottom: rh(0.3),
                    }}
                  />
                )}
              </>
            )}
          </Pressable>
        </View>
      ) : null}

      <View style={styles.bottomFooter}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '95%',
          }}>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Pressable
              onPress={() => onLike()}
              style={{
                margin: 0,
                justifyContent: 'center',
              }}>
              {liked ? (
                <ELike style={{ width: 18, height: 18 }} />
              ) : (
                <DLike style={{ width: 18, height: 18 }} />
              )}
            </Pressable>
            <Text style={{ marginLeft: 5 }} color={COLORS.textLight}>
              {(likeGap.data && likeGap.data.data.like) || memory.like}
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
              <CmIcon style={{ width: 18, height: 18 }} />
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
                onPress={() => handleReportModal(memory.id)}
                style={{ margin: 0, justifyContent: 'center' }}>
                <MaterialCommunityIcons
                  name="shield-alert-outline"
                  size={16}
                  color={COLORS.icon}
                />
              </Pressable>
            </View>
          )}

          <Text
            bold
            size={8}
            style={{ marginLeft: 10 }}
            color={COLORS.textLight}>
            {calcDiffDays(memory.created_at)} روز
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GapCard;
