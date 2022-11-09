/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Text } from '../../../components/common';

import { storeExpectationApi } from '../apis';
import { useApi, useIsPeriodDay } from '../../../libs/hooks';
import { baseUrl, COLORS, rh, rw } from '../../../configs';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';

const ExpSympInfoModal = ({
  item,
  visible,
  closeModal,
  setSnackbar,
  updateMyExps,
  isExp = false,
}) => {
  const isPeriodDay = useIsPeriodDay();
  const womanInfo = useContext(WomanInfoContext);
  const [isSending, setIsSending] = useState(false);

  const [storeExpectation, setStoreExpectation] = useApi(() =>
    storeExpectationApi(item.id, womanInfo.activeRel.relId),
  );
  const onStoreExpectation = async function () {
    setIsSending(true);
    setStoreExpectation();
  };

  useEffect(() => {
    if (storeExpectation.data && storeExpectation.data.is_successful) {
      setIsSending(false);
      setSnackbar({
        msg: 'با موفقیت ثبت شد.',
        visible: true,
        type: 'success',
      });
      updateMyExps();
      closeModal();
    }
    if (storeExpectation.data && !storeExpectation.data.is_successful) {
      setIsSending(false);
      setSnackbar({
        msg: storeExpectation.data.message,
        visible: true,
      });
      closeModal();
    }
  }, [storeExpectation]);

  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.1}
      backdropTransitionOutTiming={1}
      animationOutTiming={0}
      animationInTiming={0}
      onBackdropPress={isSending ? () => {} : () => closeModal()}
      animationIn="zoomIn"
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: 'white',
        }}>
        <View style={styles.header}>
          <AntDesign
            onPress={isSending ? () => {} : () => closeModal()}
            name="close"
            size={26}
            color={COLORS.expSympReadMore}
            style={styles.closeIcon}
          />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={
              item.image
                ? { uri: baseUrl + item.image }
                : require('../../../assets/images/icons8-heart-100.png')
            }
            style={{
              width: item.image ? 140 : 100,
              height: item.image ? 140 : 100,
            }}
            resizeMode="contain"
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text color={COLORS.textCommentCal} bold medium marginTop={rh(2)}>
            {item.title}
          </Text>
          {item.description ? (
            <Text
              bold
              color={COLORS.textLight}
              marginTop={rh(2)}
              textAlign="right"
              alignSelf="center">
              {item.description.replace(/(<([^>]+)>)/gi, '')}
            </Text>
          ) : null}
        </ScrollView>
        {isExp && (
          <Pressable
            onPress={() => onStoreExpectation()}
            style={styles.submitBtn}>
            {isSending ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <Text bold color={COLORS.primary}>
                ثبت
              </Text>
            )}
          </Pressable>
        )}
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
  btn: { width: '40%', height: 40, margin: 20, alignSelf: 'center' },
  imageContainer: {
    alignItems: 'center',
    width: rw(71),
    borderRightWidth: 3,
    borderRightColor: COLORS.icon,
    marginTop: rh(2),
  },
  submitBtn: {
    width: rw(67),
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: rh(4),
    borderRadius: 25,
    height: rh(5.5),
    justifyContent: 'center',
  },
});

export default ExpSympInfoModal;
