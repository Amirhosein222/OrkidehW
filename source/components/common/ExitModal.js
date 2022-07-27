/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  WomanInfoContext,
  saveWomanRelations,
  saveActiveRel,
} from '../../libs/context/womanInfoContext';

import { Text } from './index';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS } from '../../configs';

const ExitModal = ({ visible, closeModal, navigation }) => {
  const { saveFullInfo } = useContext(WomanInfoContext);
  const isPeriodDay = useIsPeriodDay();

  const onLogOut = async function () {
    await AsyncStorage.setItem('logedOut', 'true');
    // AsyncStorage.removeItem('periodStart');
    // AsyncStorage.removeItem('fullInfo');
    // AsyncStorage.removeItem('rels');
    // AsyncStorage.removeItem('fcmTokenSent');

    // saveWomanRelations([]);
    // saveFullInfo([]);
    // saveActiveRel(null);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
          },
        ],
      }),
    );
  };

  return (
    <Modal
      isVisible={visible}
      coverScreen={true}
      hasBackdrop={true}
      backdropOpacity={0.2}
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
        <Text color={COLORS.dark} marginRight="10">
          آیا میخواهید از حساب کاربری خود خارج شوید؟
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Button
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            mode="contained"
            style={styles.btn}
            onPress={() => closeModal()}>
            <Text color="white">نه</Text>
          </Button>
          <Button
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            mode="contained"
            style={styles.btn}
            onPress={() => onLogOut()}>
            <Text color="white">اره</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.pink,
    borderRadius: 20,
    height: '30%',
    justifyContent: 'center',
    elevation: 5,
    alignItems: 'center',
  },
  btn: { width: '40%', height: 40, margin: 10, alignSelf: 'center' },
});

export default ExitModal;
