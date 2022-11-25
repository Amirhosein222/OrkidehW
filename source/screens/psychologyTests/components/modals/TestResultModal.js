/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import Slider from '@react-native-community/slider';

import { Text } from '../../../../components/common';
import { rw, rh, COLORS, baseUrl } from '../../../../configs';
import { useIsPeriodDay } from '../../../../libs/hooks';

const TestResultModal = ({ testInfo, visible, closeModal }) => {
  const isPeriodDay = useIsPeriodDay();

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

        {testInfo.image ? (
          <Image
            source={{ uri: baseUrl + testInfo.image }}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        ) : (
          <Octicons
            name="checklist"
            size={70}
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          />
        )}

        <View style={{ paddingHorizontal: rw(2) }}>
          <Text size={12} color={COLORS.textDark} marginTop={rh(2)}>
            {testInfo.title}
          </Text>
        </View>

        <View style={{ width: rw(70), marginVertical: rh(1) }}>
          <Text size={11} color={COLORS.textLight} textAlign="right">
            {testInfo.des.replace(/(<([^>]+)>)/gi, '')}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}>
            {testInfo.score}{' '}
          </Text>
          <Text color={COLORS.textLight} marginRight={rw(2)}>
            / {testInfo.total}
          </Text>
          <Text medium color={COLORS.textDark}>
            امتیاز شما در این تست :
          </Text>
        </View>
        <View
          style={{
            width: testInfo.total * 2,
            height: 10,
            backgroundColor: COLORS.inputTabBarBg,
            borderRadius: 20,
            marginBottom: rh(1),
          }}>
          <View
            style={{
              position: 'absolute',
              width: testInfo.score * 2,
              height: 8,
              backgroundColor: isPeriodDay
                ? COLORS.fireEngineRed
                : COLORS.primary,
              borderRadius: 20,
              marginBottom: 5,
            }}
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
    marginBottom: rh(1),
  },
});

export default TestResultModal;
