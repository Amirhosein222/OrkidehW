/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Text from '../common/Text';

import { useIsPeriodDay } from '../../libs/hooks';
import { baseUrl, COLORS, rh, rw } from '../../configs';

const ExpSympInfoModal = ({ item, visible, closeModal }) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.1}
      backdropTransitionOutTiming={1}
      animationOutTiming={0}
      animationInTiming={0}
      onBackdropPress={() => closeModal()}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: 'white',
        }}>
        <View style={styles.header}>
          <AntDesign
            onPress={() => closeModal()}
            name="close"
            size={26}
            color={COLORS.expSympReadMore}
            style={styles.closeIcon}
          />
        </View>
        <Image
          source={
            item.image
              ? { uri: baseUrl + item.image }
              : require('../../assets/images/icons8-heart-100.png')
          }
          style={styles.icon}
        />
        <ScrollView>
          <Text color={COLORS.expSympTitle} bold large marginTop={rh(2)}>
            {item.title}
          </Text>
          {item.description ? (
            <Text
              color={COLORS.dark}
              medium
              marginTop={rh(2)}
              textAlign="right"
              alignSelf="center">
              {item.description.replace(/(<([^>]+)>)/gi, '')}
            </Text>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    alignSelf: 'center',
  },
  header: {
    marginTop: rh(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  closeIcon: {
    marginRight: rw(2),
  },
  icon: {
    width: 100,
    height: 100,
  },
  modalContent: {
    alignSelf: 'center',
    width: '85%',
    borderRadius: 20,
    paddingHorizontal: rw(3),
    paddingVertical: rh(2),
    elevation: 5,
    alignItems: 'center',
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
    margin: 10,
  },
  btn: { width: '40%', height: 40, margin: 20, alignSelf: 'center' },
});

export default ExpSympInfoModal;
