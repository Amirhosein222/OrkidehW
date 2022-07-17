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
  multiline = true,
  lineNums = 2,
  testId,
  inputName,
  textColor,
  editedText = null,
  fontWeight = 'normal',
}) => {
  const styles = StyleSheet.create({
    input: {
      textAlign: 'right',
      width: '70%',
      backgroundColor: COLORS.lightPink,
      color: textColor ? textColor : 'white',
      borderRadius: 5,
      fontFamily: fontWeight === 'normal' ? 'Vazir' : 'Vazir-Bold',
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
      testId="textInput"
      onChangeText={(value) => onChangeText(value, inputName)}
      onSubmitEditing={onSubmitEditing ? () => onSubmitEditing() : () => {}}
    />
  );
};

export default Input;
