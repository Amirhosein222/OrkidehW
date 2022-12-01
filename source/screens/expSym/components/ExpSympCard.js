/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { baseUrl, COLORS } from '../../../configs';
import { rw, rh } from '../../../configs';
import { useIsPeriodDay } from '../../../libs/hooks';

const ExpSympCard = ({
  item,
  onPress,
  onReadMore,
  isExp = false,
  alreadySelected,
}) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: alreadySelected ? COLORS.lightPink : COLORS.cardBg,
      }}>
      {alreadySelected && (
        <AntDesign
          name="checkcircle"
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          size={32}
          style={styles.selectedBadge}
        />
      )}

      <Pressable onPress={() => onPress(item)}>
        <Image
          source={
            item.image
              ? { uri: baseUrl + item.image }
              : require('../../../assets/images/icons8-heart-100.png')
          }
          style={styles.icon}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text
          style={[styles.text, { color: COLORS.textCommentCal, fontSize: 12 }]}>
          {item.title}
        </Text>
        {alreadySelected && !isExp ? (
          <View style={styles.degreeContainer}>
            <Text
              style={[
                styles.text,
                { color: COLORS.textLight, fontSize: 10.5 },
              ]}>
              میزان {item.title} امروز شما :{' '}
              <Text
                style={[
                  {
                    color: isPeriodDay ? COLORS.periodDay : COLORS.primary,
                    fontSize: 10.5,
                  },
                ]}>
                {alreadySelected.mood.title}
              </Text>
            </Text>
          </View>
        ) : (
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: rw(39),
    borderRadius: 20,
    elevation: 5,
    marginVertical: rh(2),
    marginHorizontal: rw(3),
    paddingBottom: rh(1.5),
  },
  icon: {
    width: 100,
    height: 100,
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
    paddingRight: rw(3),
    marginTop: rh(2),
  },
  selectedBadge: {
    ...StyleSheet.absoluteFillObject,
    top: rh(-1.5),
    left: rw(-3),
    // zIndex: 1,
  },
  degreeContainer: {
    flexDirection: 'row',
    width: '90%',
    flexShrink: 1,
  },
});

export default ExpSympCard;
