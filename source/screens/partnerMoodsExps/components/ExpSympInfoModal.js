/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Text } from '../../../components/common';

import { baseUrl, COLORS, rh, rw } from '../../../configs';

const ExpSympInfoModal = ({ item, visible, closeModal }) => {
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
        <View style={styles.imageContainer}>
          <Image
            source={
              item.expectation.image
                ? { uri: baseUrl + item.expectation.image }
                : require('../../../assets/images/icons8-heart-100.png')
            }
            style={{
              width: item.expectation.image ? 140 : 100,
              height: item.expectation.image ? 140 : 100,
            }}
            resizeMode="contain"
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginHorizontal: rw(4) }}>
          <Text
            color={COLORS.textCommentCal}
            bold
            textAlign="right"
            marginTop={rh(2)}>
            {item.expectation.title}
          </Text>
          {item.expectation.description ? (
            <Text
              bold
              color={COLORS.textLight}
              marginTop={rh(2)}
              textAlign="right"
              alignSelf="center">
              {item.expectation.description.replace(/(<([^>]+)>)/gi, '')}
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
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  closeIcon: {
    marginRight: rw(2.5),
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
  imageContainer: {
    alignItems: 'center',
    width: rw(71),
    borderRightWidth: 3,
    borderRightColor: COLORS.icon,
    marginTop: rh(2),
  },
});

export default ExpSympInfoModal;
