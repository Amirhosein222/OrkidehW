/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text } from '../index';

import { COLORS, rh, rw } from '../../../configs';
import { adjust } from '../../../libs/helpers';

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
  editable = true,
}) => {
  return (
    <View
      style={{
        ...styles.container,
        ...containerStyle,
      }}>
      <View>
        <TextInput
          placeholder={placeholder}
          textColor={COLORS.textLight}
          placeholderTextColor={COLORS.textLight}
          style={{
            ...styles.input,
            ...inputStyle,
            backgroundColor: !editable
              ? 'rgba(200,200,200, 0.4)'
              : COLORS.inputTabBarBg,
            borderBottomWidth: isValid === false || required ? 2 : 0,
            borderBottomColor: isValid === false || (required && COLORS.error),
          }}
          keyboardType={kType}
          returnKeyType={returnKey}
          onChangeText={handleTextInput}
          inputName={name}
          value={editedText}
          editable={editable}
        />
        {isValid === false || required ? (
          <Text size={8} color={COLORS.error} bold alignSelf="flex-end">
            {tipText}
          </Text>
        ) : null}
      </View>

      <View style={{ width: rw(27), ...textStyle }}>
        <Text size={11} color={COLORS.textLight} alignSelf="flex-end">
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
    height: rh(5.3),
    backgroundColor: COLORS.inputTabBarBg,
    borderRadius: 5,
    fontSize: adjust(10),
    fontFamily: 'IRANYekanMobileBold',
    color: COLORS.textLight,
  },
});

export default InputRow;
