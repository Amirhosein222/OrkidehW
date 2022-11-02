/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Button, Text } from '../../../../components/common';
import { rw, rh, COLORS } from '../../../../configs';

const DiffDaysModal = ({ visible, closeModal, handleUserDiffChoice }) => {
  const [reportOption, setReportOption] = useState('');

  const handleUserChoice = choice => {
    handleUserDiffChoice(choice);
    closeModal();
  };

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

        <View style={{ width: rw(75), marginTop: rh(2.2) }}>
          <Text
            bold
            size={14}
            color={COLORS.textDark}
            marginTop={rh(2)}
            textAlign="right">
            آیا مایلید روزهای بین بازه زمانی انتخاب شده هم به عنوان روز پریود
            ثبت شوند؟
          </Text>
        </View>
        <View
          style={{
            marginTop: 'auto',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Button
            title="نه"
            color={COLORS.primary}
            onPress={() => handleUserChoice('no')}
            style={{ marginTop: 'auto', marginBottom: rh(3), width: rw(35) }}
          />
          <Button
            title="اره"
            color={COLORS.primary}
            onPress={() => handleUserChoice('yes')}
            style={{ marginTop: 'auto', marginBottom: rh(3), width: rw(35) }}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(82),
    height: rh(30),
    elevation: 5,
    borderRadius: 25,
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
});

export default DiffDaysModal;
