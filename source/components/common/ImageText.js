/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

const ImageText = ({ title, img, width }) => {
  const styles = StyleSheet.create({
    container: {
      width: width,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      alignSelf: 'center',
      borderRadius: 5,
      margin: 10,
    },
    img: {
      height: 120,
      width: width,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0, 0.1)',
      width: width,
    },
    titleContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 24,
      color: 'white',
    },
  });

  return (
    <TouchableOpacity style={styles.container}>
      <Image source={img} style={styles.img} />

      {/* <View style={styles.overlay} /> */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ImageText;
