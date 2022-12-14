/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, View, StyleSheet, Image } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';

import { Text } from '../../../../components/common';

import { useIsPeriodDay } from '../../../../libs/hooks';
import { baseUrl, COLORS, ICON_SIZE, rh, rw } from '../../../../configs';

import DisabledBack from '../../../../assets/icons/btns/disabled-back.svg';

const PsychologyTestCard = ({
  testTitle,
  description,
  testImage,
  navigation,
  testId,
  showAlert,
}) => {
  const isPeriodDay = useIsPeriodDay();
  const handleNavigation = function () {
    navigation.navigate('PsychologyTestDetails', {
      testId: testId,
      testImage,
      description,
      showAlert: showAlert,
    });
  };

  return (
    <Pressable onPress={() => handleNavigation()} style={styles.container}>
      {testImage ? (
        <Image
          source={{ uri: baseUrl + testImage }}
          style={{ width: 150, height: 150, borderRadius: 7 }}
          resizeMode="cover"
        />
      ) : (
        <Octicons
          name="checklist"
          size={100}
          style={{ marginLeft: rh(2) }}
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
        />
      )}

      <View
        style={{
          ...styles.badge,
          backgroundColor: isPeriodDay ? COLORS.periodDay : COLORS.primary,
        }}>
        <Text color={COLORS.white}>جدید</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: rw(4),
          paddingVertical: rh(1.5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginTop: rh(0.5),
          }}>
          <DisabledBack style={ICON_SIZE} />
          <Text
            small
            marginLeft="10"
            alignSelf="flex-end"
            bold
            color={isPeriodDay ? COLORS.periodDay : COLORS.primary}>
            0
          </Text>
          <Text small alignSelf="flex-end" bold color={COLORS.textLight}>
            /100
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexShrink: 1,
            borderRightWidth: 3,
            borderRightColor: COLORS.textLight,
            alignSelf: 'flex-end',
            paddingRight: rw(1),
          }}>
          <Text
            marginRight="10"
            alignSelf="flex-end"
            bold
            size={10}
            color={COLORS.textCommentCal}>
            {testTitle}
          </Text>
          <Text
            size={10}
            color={COLORS.textLight}
            marginRight="10"
            alignSelf="flex-end"
            marginTop="5"
            bold
            textAlign="right">
            {description ? description.replace(/(<([^>]+)>)/gi, '') : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '82%',
    alignItems: 'center',
    margin: 15,
    backgroundColor: COLORS.cardBg,
    elevation: 3,
    borderRadius: 20,
    alignSelf: 'center',
    paddingVertical: rh(1),
    marginVertical: rh(2),
  },
  badge: {
    width: rw(12),
    height: rw(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 40,
    position: 'absolute',
    left: rw(-4),
    top: rh(-2),
  },
});

export default PsychologyTestCard;
