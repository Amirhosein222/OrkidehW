import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { COLORS } from '../../configs';

const Input = ({
  onChangeText,
  onSubmitEditing = null,
  placeholder,
  keyboardType,
  style,
  phColor,
  multiline = false,
  lineNums = 2,
  testId,
  inputName,
  textColor,
  editedText = null,
  fontWeight = 'normal',
  secureTextEntry = false,
  returnKeyType = 'done',
}) => {
  const styles = StyleSheet.create({
    input: {
      textAlign: 'right',
      color: textColor ? textColor : 'white',
      borderRadius: 5,
      fontFamily:
        fontWeight === 'normal' ? 'IRANYekanMobileBold' : 'IRANYekanMobileBold',
      fontSize: 13,
    },
  });
  return (
    <TextInput
      placeholder={placeholder}
      multiline={multiline}
      value={editedText}
      numberOfLines={lineNums}
      placeholderTextColor={phColor ? phColor : '#fff'}
      style={[styles.input, style]}
      keyboardType={keyboardType}
      onChangeText={(value) => onChangeText(value, inputName)}
      onSubmitEditing={onSubmitEditing ? () => onSubmitEditing() : () => {}}
      returnKeyType="done"
      // secureTextEntry={secureTextEntry}
    />
  );
};

export default Input;
