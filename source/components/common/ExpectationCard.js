/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { Text } from '../../components/common';
import { baseUrl, COLORS, rw, rh } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const ExpectationCard = ({ exp, onRight = false }) => {
  const isPeriodDay = useIsPeriodDay();

  const styles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      flexDirection: 'row',
      width: rw(75),
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      elevation: 5,
      borderRadius: 10,
      margin: 10,
      paddingRight: rh(0.5),
    },
    img: {
      height: 65,
      width: 65,
      margin: 5,
      borderRadius: 7,
    },
    imgContainer: {
      ...StyleSheet.absoluteFillObject,
      left: -20,
    },
    titleContainer: {
      flexShrink: 1,
      marginRight: 5,
      width: '60%',
    },
    title: {
      fontSize: 18,
      color: COLORS.primary,
    },
  });

  if (onRight === true) {
    return (
      <TouchableOpacity style={styles.container}>
        {/* <View style={styles.overlay} /> */}
        <View style={styles.titleContainer}>
          <Text color={isPeriodDay ? COLORS.periodDay : COLORS.primary} medium>
            {exp.expectation.title}
          </Text>
          <Text small>{exp.expectation.title}</Text>
        </View>

        <View>
          <Image
            source={
              exp.expectation.image
                ? { uri: baseUrl + exp.expectation.image }
                : require('../../assets/images/de.png')
            }
            style={styles.img}
          />
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={styles.container}>
        <View>
          <Image
            source={
              exp.expectation.image
                ? { uri: baseUrl + exp.expectation.image }
                : require('../../assets/images/de.png')
            }
            style={styles.img}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text
            color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
            medium
            textAlign="right"
            alignSelf="flex-end">
            {exp.expectation.title}
          </Text>
          <Text small textAlign="right" alignSelf="flex-end">
            {exp.expectation.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
};

export default ExpectationCard;
