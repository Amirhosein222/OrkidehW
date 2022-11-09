import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Text } from '../../../../../components/common';
import { COLORS, rh, rw } from '../../../../../configs';

const ReminderTextInput = ({
  openPicker,
  setText,
  type,
  time,
  text,
  handleDefaultTime,
  handleDefaultText,
}) => {
  const [defaultTime, setDefaultTime] = useState();

  useEffect(() => {
    setDefaultTime(handleDefaultTime(type));

    return () => {
      setDefaultTime();
    };
  }, []);

  return (
    <View>
      <View style={styles.content}>
        <Pressable onPress={() => openPicker(type)} style={styles.setClock}>
          <FontAwesome
            name="caret-down"
            size={22}
            color={COLORS.textLight}
            style={{ marginLeft: rw(3) }}
          />
          <Text
            color={COLORS.textLight}
            // alignSelf="flex-end"
            marginRight={rw(1)}>
            {time || defaultTime}
          </Text>
        </Pressable>
        <Text color={COLORS.textDark} marginTop={rh(2)}>
          ساعت نمایش یادآور:{' '}
        </Text>
      </View>
      <View style={styles.textInputContainer}>
        <Text color={COLORS.textDark} alignSelf="flex-end" marginBottom={rh(1)}>
          متن یادآور:
        </Text>
        <TextInput
          onChangeText={value => setText(type, value)}
          placeholder="متن یادآور را اینجا وارد کنید"
          placeholderTextColor={COLORS.textLight}
          style={styles.inputArea}
          returnKeyType="next"
          multiline
          defaultValue={text}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.inputTabBarBg,
    marginTop: rh(2),
    flexDirection: 'row',
  },
});

export default ReminderTextInput;
