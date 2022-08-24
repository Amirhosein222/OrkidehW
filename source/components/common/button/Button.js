import React from 'react';
import {
  Image,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from '../index';
import { COLORS, rh, rw } from '../../../configs';

const Button = ({
  title,
  icons,
  color,
  onPress,
  style,
  loading = false,
  disabled,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        ...styles.container,
        borderColor: disabled ? COLORS.textLight : color,
        ...style,
      }}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.textLight} />
      ) : (
        <View style={styles.content}>
          <Text color={disabled ? COLORS.textLight : color}>{title}</Text>
          {icons && (
            <Image
              source={disabled ? icons[0] : icons[1]}
              style={{ width: 30, height: 30, marginTop: rh(0.5) }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: rw(83.5),
    height: rh(5.5),
    backgroundColor: COLORS.mainBg,
    borderWidth: 2,
    borderRadius: 30,
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;
