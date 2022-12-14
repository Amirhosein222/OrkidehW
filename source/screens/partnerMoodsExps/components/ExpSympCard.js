/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';

import { baseUrl, COLORS } from '../../../configs';
import { rw, rh } from '../../../configs';
import { useIsPeriodDay } from '../../../libs/hooks';

const ExpSympCard = ({ item, type, onReadMore }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <View style={styles.container}>
      <Image
        source={
          type === 'exp' && item.expectation.image
            ? { uri: baseUrl + item.expectation.image }
            : type === 'sign' && item.sign.image
            ? { uri: baseUrl + item.sign.image }
            : require('../../../assets/images/icons8-heart-100.png')
        }
        style={styles.icon}
      />
      <View style={styles.titleContainer}>
        <Text
          style={[styles.text, { color: COLORS.textCommentCal, fontSize: 11 }]}>
          {type === 'exp' ? item.expectation.title : item.sign.title}
        </Text>
        {type === 'sign' ? (
          <View style={styles.degreeContainer}>
            <Text
              style={[
                styles.text,
                { color: COLORS.textLight, fontSize: 10.5 },
              ]}>
              میزان {item.sign.title} امروز دلبر شما :{' '}
              <Text
                style={[
                  {
                    color: isPeriodDay ? COLORS.periodDay : COLORS.primary,
                    fontSize: 10.5,
                  },
                ]}>
                {item.mood.title}
              </Text>
              <Text
                style={[
                  {
                    color: isPeriodDay ? COLORS.periodDay : COLORS.primary,
                    fontSize: 10.5,
                  },
                ]}>
                {item.title}
              </Text>
            </Text>
          </View>
        ) : null}
        {type === 'exp' ? (
          <Pressable onPress={() => onReadMore(item)} hitSlop={5}>
            <Text
              style={{
                ...styles.text,
                color: '#B7AFB9',
                marginTop: rh(0.2),
                fontSize: 10,
              }}>
              بیشتر بخوانید...
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: rw(40),
    borderRadius: 23,
    elevation: 5,
    marginVertical: rh(2),
    marginHorizontal: rw(3),
    paddingBottom: rh(2),
  },
  icon: {
    width: 120,
    height: 120,
    marginTop: rh(1),
  },
  text: {
    flexShrink: 1,
    fontFamily: 'IRANYekanMobileBold',
  },
  titleContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: rw(3),
    justifyContent: 'center',
    flexShrink: 1,
    borderRightWidth: 2,
    borderRightColor: COLORS.expSympReadMore,
    paddingHorizontal: rw(3),
    marginTop: rh(2),
  },
  degreeContainer: {
    flexDirection: 'row',
    width: '90%',
    flexShrink: 1,
  },
});

export default ExpSympCard;
