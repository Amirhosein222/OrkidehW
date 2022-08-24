/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text } from '../index';

import { COLORS, rh, rw } from '../../../configs';

const InputRow = ({
  handleTextInput,
  title,
  kType,
  name,
  placeholder,
  containerStyle,
  isValid = null,
  required = false,
  tipText,
  returnKey,
  inputStyle = {},
  textStyle = {},
  textSmall = false,
  editedText = null,
}) => {
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <View>
        <TextInput
          placeholder={placeholder}
          textColor={COLORS.textLight}
          placeholderTextColor={COLORS.textLight}
          style={{
            ...styles.input,
            ...inputStyle,
            borderBottomWidth: isValid === false || required ? 2 : 0,
            borderBottomColor: isValid === false || (required && COLORS.error),
          }}
          keyboardType={kType}
          returnKeyType={returnKey}
          onChangeText={handleTextInput}
          inputName={name}
          value={editedText}
        />
        {isValid === false || required ? (
          <Text small color={COLORS.error} bold alignSelf="flex-end">
            {tipText}
          </Text>
        ) : null}
      </View>

      <View style={{ width: rw(27), ...textStyle }}>
        <Text color={COLORS.textLight} bold alignSelf="flex-end">
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: rw(100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: rh(1),
  },
  input: {
    width: rw(55),
    height: rh(5.5),
    backgroundColor: COLORS.inputTabBarBg,
    borderRadius: 5,
    fontSize: 13,
    fontFamily: 'Qs_Iranyekan_bold',
    color: COLORS.textLight,
  },
});

export default InputRow;
