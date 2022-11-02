/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Button, Text } from '../../../../components/common';
import { rw, rh, COLORS } from '../../../../configs';

const TestResultModal = ({ tid, visible, closeModal }) => {
  const [rudeness, setRudeness] = useState(false);

  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      coverScreen={true}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={0}
      animationOutTiming={0}
      animationInTiming={0}
      animationIn="slideInUp"
      onBackdropPress={closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ marginLeft: 'auto' }} />
          <Pressable
            onPress={closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>

        <Image
          source={require('../../../../assets/images/icons8-heart-100.png')}
          style={styles.image}
        />

        <View style={{ paddingHorizontal: rw(2) }}>
          <Text medium color={COLORS.textDark} marginTop={rh(2)}>
            تست پذیرش اجتماعی
          </Text>
        </View>

        <Text color={COLORS.textLight} marginBottom={rh(2)} marginTop={rh(1)}>
          توضیحات تست پذیرش اجتماعی
        </Text>

        <View style={styles.scoreContainer}>
          <Text color={COLORS.primary}>80</Text>
          <Text color={COLORS.textLight} marginRight={rw(2)}>
            /100
          </Text>
          <Text medium color={COLORS.textDark}>
            امتیاز شما در این تست :
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
  },
  content: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: rw(82),
    // height: rh(45),
    elevation: 5,
    borderRadius: 30,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(2),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
  imageContainer: {
    width: rw(90),
    alignItems: 'center',
    marginBottom: rh(2),
  },
  image: {
    width: 100,
    height: 100,
  },
  scoreContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: rh(4),
  },
});

export default TestResultModal;
