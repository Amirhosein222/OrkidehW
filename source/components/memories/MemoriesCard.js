/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Image } from '../common';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment-jalaali';

import { Text } from '../common';
import { COLORS } from '../../configs';
import { getFromAsyncStorage, numberConverter } from '../../libs/helpers';
import ReadMore from '@fawazahmed/react-native-read-more';

const MemoriesCard = ({
  memory = null,
  myMemory = false,
  navigation,
  handleNewMemory,
}) => {
  const [liked, setLiked] = useState({ id: null, liked: false });
  const [info, setInfo] = useState(null);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '95%',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      alignSelf: 'center',
      backgroundColor: '#fcfcff',
      elevation: 3,
      overflow: 'hidden',
    },
    topHeader: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '90%',
    },
    bottomFooter: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      marginLeft: 15,
      marginBottom: 5,
    },
    safe: {
      flex: 1,
    },
    root: {
      flex: 1,
      padding: 16,
    },
    textStyle: {
      fontSize: 13,
    },
    moreLess: {
      color: COLORS.pink,
      fontFamily: 'Vazir',
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
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          {myMemory && info ? (
            <View>
              <Text marginRight="10" alignSelf="flex-end">
                {info.display_name}
              </Text>
              <Text alignSelf="flex-end" marginRight="10">
                {moment(memory.created_at, 'X')
                  .locale('en')
                  .format('jYYYY/jM/jD')}
              </Text>
            </View>
          ) : (
            <View>
              <Text marginRight="10" alignSelf="flex-end">
                {memory.hasOwnProperty('user')
                  ? memory.user.display_name
                  : 'نگار قاسمی'}
              </Text>
              <Text alignSelf="flex-end" marginRight="10">
                {moment(memory.created_at, 'X')
                  .locale('fa')
                  .format('jYYYY/jM/jD')}
              </Text>
            </View>
          )}
          <Image
            imageSource={require('../../assets/images/Ellipse.png')}
            width="45px"
            height="45px"
          />
        </View>
      </View>

      <View style={styles.label}>
        {myMemory === false ? null : memory.is_accepted === 1 ? (
          <Text marginRight="30" small color={COLORS.white}>
            تایید شده
          </Text>
        ) : memory.is_accepted === 2 ? (
          <Text marginRight="30" small color={COLORS.white}>
            درحال بررسی
          </Text>
        ) : (
          <Text marginRight="30" small color={COLORS.white}>
            تایید نشده
          </Text>
        )}
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={styles.root}>
          <ReadMore
            numberOfLines={3}
            seeMoreText="بیشتر"
            seeMoreStyle={styles.moreLess}
            seeLessStyle={styles.moreLess}
            wrapperStyle={{ flexDirection: 'column' }}
            ellipsis="..."
            style={{ color: COLORS.dark, fontFamily: 'Vazir' }}
            seeLessText="بستن">
            {numberConverter(memory.text)}
          </ReadMore>
        </View>
      </SafeAreaView>

      <View style={styles.bottomFooter}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '95%',
          }}>
          {memory.is_accepted === 1 ? (
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Pressable
                onPress={() => handleLike(memory)}
                style={{ margin: 5 }}>
                <Icon
                  name="heart"
                  size={24}
                  color={liked.liked ? COLORS.pink : COLORS.dark}
                />
              </Pressable>
              <Text style={{ marginLeft: 5 }}>
                {numberConverter(memory.like)}
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {myMemory === true ? (
            <Pressable
              onPress={() =>
                navigation.navigate('AddMemory', {
                  edit: true,
                  text: memory.text,
                  title: memory.title,
                  id: memory.id,
                  handleNewMemory: handleNewMemory,
                })
              }
              style={{ margin: 5 }}>
              <Text color={COLORS.pink}>ویرایش</Text>
            </Pressable>
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  );
};

export default MemoriesCard;
