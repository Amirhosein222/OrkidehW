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
          bgColor="white">
          <Pressable onPress={() => closeModal()}>
            <Icon name="closecircle" color={COLORS.dark} size={28} />
          </Pressable>
          <Text medium bold color={COLORS.dark}>
            پیام
          </Text>
        </RowContainer>
        <Text margin="10" color={COLORS.dark}>
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
    backgroundColor: 'white',
    height: '40%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});

export default BottomHalfModal;
