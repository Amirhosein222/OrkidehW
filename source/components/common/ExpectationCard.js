/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { Text } from '../../components/common';
import { COLORS } from '../../configs';

const ExpectationCard = ({ exp, onRight = false }) => {
  const styles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      flexDirection: 'row',
      width: '75%',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      elevation: 5,
      borderRadius: 10,
      margin: 10,
    },
    img: {
      height: 90,
      width: 90,
      margin: 5,
    },
    imgContainer: {
      ...StyleSheet.absoluteFillObject,
      left: -20,
    },
    titleContainer: {
      flexShrink: 1,
      marginRight: 5,
      width: '40%',
    },
    title: {
      fontSize: 18,
      color: COLORS.pink,
    },
  });

  if (onRight === true) {
    return (
      <TouchableOpacity style={styles.container}>
        {/* <View style={styles.overlay} /> */}
        <View style={styles.titleContainer}>
          <Text color={COLORS.pink} medium>
            {exp.expectation.title}
          </Text>
          <Text small>{exp.expectation.title}</Text>
        </View>

        <View>
          <Image
            source={
              exp.expectation.image
                ? { uri: exp.expectation.image }
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
                ? { uri: exp.expectation.image }
                : require('../../assets/images/de.png')
            }
            style={styles.img}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text color={COLORS.pink} medium alignSelf="flex-end">
            {exp.expectation.title}
          </Text>
          <Text small textAlign="right">
            {exp.expectation.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
};

export default ExpectationCard;
