import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import { Text } from '../../../../../components/common';
import { COLORS, rh, rw } from '../../../../../configs';

const ReminderTextInput = ({ setText }) => {
  return (
    <View>
      <View style={styles.content}>
        <View style={styles.setClock}>
          <Text
            color={COLORS.textLight}
            alignSelf="flex-end"
            marginRight={rw(2)}>
            10:00
          </Text>
        </View>
        <Text color={COLORS.textDark} marginTop={rh(2)}>
          ساعت نمایش یادآور:{' '}
        </Text>
      </View>
      <View style={styles.textInputContainer}>
        <Text color={COLORS.textDark} alignSelf="flex-end" marginBottom={rh(1)}>
          متن یادآور:
        </Text>
        <TextInput
          onChangeText={setText}
          placeholder="متن یادآور را اینجا وارد کنید"
          placeholderTextColor={COLORS.textLight}
          style={styles.inputArea}
          returnKeyType="next"
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    width: rw(82),
    justifyContent: 'space-between',
  },
  inputArea: {
    backgroundColor: COLORS.inputTabBarBg,
    height: rh(12),
    width: rw(81),
    borderRadius: 10,
    color: COLORS.textLight,
    fontFamily: 'IRANYekanMobileBold',
    textAlign: 'right',
    textAlignVertical: 'top',
    fontSize: 14,
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '80%',
    alignSelf: 'center',
    marginTop: rh(2),
  },
  setClock: {
    width: rw(30),
    height: rh(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.inputTabBarBg,
    marginTop: rh(2),
  },
});

export default ReminderTextInput;
