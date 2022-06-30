import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';

import Text from './Text';
import RowContainer from './RowContainer';
import { COLORS } from '../../configs';

const BottomHalfModal = ({ visible, closeModal, text }) => {
  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={0}
      animationOutTiming={1}
      animationInTiming={0}
      onBackdropPress={() => closeModal()}
      animationIn="slideInUp"
      style={styles.view}>
      <View style={styles.modalContent}>
        <RowContainer
          borderRadius={40}
          justifyContent="space-between"
          bgColor={COLORS.pink}>
          <Pressable onPress={() => closeModal()}>
            <Icon name="closecircle" color={COLORS.white} size={28} />
          </Pressable>
          <Text medium bold color={COLORS.white}>
            پیام
          </Text>
        </RowContainer>
        <Text margin="10" color={COLORS.white}>
          {text}
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.pink,
    height: '40%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});

export default BottomHalfModal;
