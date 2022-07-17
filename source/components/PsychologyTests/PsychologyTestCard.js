/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';

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
    <Pressable style={styles.container} onPress={() => handleNavigation()}>
      <View style={{ width: '70%', flexShrink: 1 }}>
        <Text
          marginRight="10"
          alignSelf="flex-end"
          bold
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          {testTitle}
        </Text>
        <Text
          marginRight="10"
          alignSelf="flex-end"
          marginTop="10"
          textAlign="right">
          {description ? description.replace(/(<([^>]+)>)/gi, '') : ''}
        </Text>
      </View>

      <IconWithBg
        bgColor={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
        width="90px"
        height="90px"
        borderRadius="50px"
        icon="text-box-check-outline"
        iconSize={55}
        marginRight={rw(3)}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    margin: 15,
    backgroundColor: COLORS.lightGrey,
    elevation: 3,
    borderRadius: 10,
    alignSelf: 'center',
    paddingVertical: rh(2),
  },
});

export default PsychologyTestCard;
