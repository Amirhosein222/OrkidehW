import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { COLORS } from '../../configs';

const Input = ({
  onChangeText,
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
}) => {
  const styles = StyleSheet.create({
    input: {
      textAlign: 'right',
      width: '70%',
      backgroundColor: COLORS.lightPink,
      color: textColor ? textColor : 'white',
      borderRadius: 5,
      fontFamily: 'Vazir',
    },
  });
  return (
    <TextInput
      placeholder={placeholder}
      multiline
      value={editedText}
      numberOfLines={lineNums}
      placeholderTextColor={phColor ? phColor : '#fff'}
      style={[styles.input, style]}
      keyboardType={keyboardType}
      testId="textInput"
      onChangeText={(value) => onChangeText(value, inputName)}
    />
  );
};

export default Input;
