/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';

import { Text } from './index';

import deleteIcon from '../../assets/vectors/register/delete.png';

import { initPusher } from '../../libs/helpers';
import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw } from '../../configs';

const ExitModal = ({ visible, closeModal, navigation }) => {
  const { savePeriodInfo } = useContext(WomanInfoContext);
  const isPeriodDay = useIsPeriodDay();

  const onLogOut = async function () {
    savePeriodInfo(null);
    initPusher('', '', true);
    await AsyncStorage.removeItem('pusherUid');
    await AsyncStorage.removeItem('isPassActive');
    await AsyncStorage.removeItem('isFingerActive');
    await AsyncStorage.removeItem('mobile');
    await AsyncStorage.removeItem('userToken');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Register',
          },
        ],
      }),
    );
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

        <View
          style={{
            alignItems: 'center',
            marginTop: 'auto',
          }}>
          <Image source={deleteIcon} style={{ width: 180, height: 180 }} />
          <Text bold medium color={COLORS.textCommentCal}>
            خروج از حساب کاربری
          </Text>
          <Text color={COLORS.textLight} marginRight="10">
            آیا می خواهید از حساب کاربری خود خارج شوید؟
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 'auto',
            marginBottom: rh(2),
          }}>
          <Button
            color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
            mode="outlined"
            style={{
              ...styles.btn,
              borderColor: isPeriodDay ? COLORS.periodDay : COLORS.primary,
            }}
            onPress={() => closeModal()}>
            <Text color={isPeriodDay ? COLORS.periodDay : COLORS.primary}>
              نه
            </Text>
          </Button>
          <Button
            color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
            mode="outlined"
            style={{
              ...styles.btn,
              borderColor: isPeriodDay ? COLORS.periodDay : COLORS.primary,
            }}
            onPress={() => onLogOut()}>
            <Text color={isPeriodDay ? COLORS.periodDay : COLORS.primary}>
              اره
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    height: '30%',
    justifyContent: 'center',
    elevation: 5,
    alignItems: 'center',
  },
  modal: {
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(80),
    height: rh(47),
    elevation: 5,
    borderRadius: 25,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(1),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
  btn: {
    width: '40%',
    margin: 10,
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default ExitModal;
