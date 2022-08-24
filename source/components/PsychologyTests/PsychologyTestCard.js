/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import { Text, IconWithBg } from '../common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw } from '../../configs';

const PsychologyTestCard = ({
  testTitle,
  description,
  navigation,
  testId,
  showAlert,
}) => {
  const isPeriodDay = useIsPeriodDay();
  const handleNavigation = function () {
    navigation.navigate('PsychologyTestDetails', {
      testId: testId,
      showAlert: showAlert,
    });
  };

  return (
    <View style={styles.container}>
      <Ionicons name="heart" size={100} color={COLORS.primary} />
      <View style={styles.badge}>
        <Text color={isPeriodDay ? COLORS.rossoCorsa : COLORS.white}>جدید</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: rw(4),
          paddingVertical: rh(1),
        }}>
        <Pressable
          onPress={() => handleNavigation()}
          style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
          <Entypo
            name="chevron-thin-left"
            size={20}
            color={COLORS.textLight}
            style={{ marginTop: rh(0.5) }}
          />
          <Text
            small
            marginLeft="10"
            alignSelf="flex-end"
            bold
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}>
            0
          </Text>
          <Text
            small
            alignSelf="flex-end"
            bold
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textDark}>
            /100
          </Text>
        </Pressable>
        <View
          style={{
            width: '100%',
            flexShrink: 1,
            borderRightWidth: 3,
            borderRightColor: COLORS.textLight,
            alignSelf: 'flex-end',
          }}>
          <Text
            marginRight="10"
            alignSelf="flex-end"
            bold
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textDark}>
            {testTitle}
          </Text>
          <Text
            color={COLORS.textLight}
            marginRight="10"
            alignSelf="flex-end"
            marginTop="5"
            textAlign="right">
            {description ? description.replace(/(<([^>]+)>)/gi, '') : ''}
          </Text>
        </View>
      </View>
    </View>
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
