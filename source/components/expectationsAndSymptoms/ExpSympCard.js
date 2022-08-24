import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { Text } from '../common';

import { baseUrl, COLORS } from '../../configs';
import { rw, rh } from '../../configs';

const ExpSympCard = ({ item, onPress, onReadMore, isExp = false }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onPress(item)}>
        {isExp.storing && isExp.exId === item.id ? (
          <View
            style={{ height: rh(13.2), width: 100, justifyContent: 'center' }}>
            <ActivityIndicator color={COLORS.primary} size="large" />
          </View>
        ) : (
          <Image
            source={
              item.image
                ? { uri: baseUrl + item.image }
                : require('../../assets/images/icons8-heart-100.png')
            }
            style={styles.icon}
          />
        )}
      </Pressable>

      <View style={styles.titleContainer}>
        <Text
          small
          bold
          color={COLORS.expSympTitle}
          textAlign="right"
          alignSelf="flex-end">
          {item.title}
        </Text>
        <Pressable onPress={() => onReadMore(item)} hitSlop={5}>
          <Text
            small
            color="#B7AFB9"
            textAlign="right"
            alignSelf="flex-end"
            marginTop={rh(0.2)}>
            بیشتر بخوانید...
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: rw(39),
    borderRadius: 23,
    elevation: 5,
    marginVertical: rh(2),
    marginHorizontal: rw(3),
    paddingBottom: rh(2),
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: rh(1),
  },
  titleContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: rw(3),
    justifyContent: 'center',
    flexShrink: 1,
    borderRightWidth: 2,
    borderRightColor: COLORS.expSympReadMore,
    paddingRight: rw(3),
    marginTop: rh(2),
  },
});

export default ExpSympCard;
