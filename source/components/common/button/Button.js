import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../index';
import { COLORS, rh, rw } from '../../../configs';

const Button = ({
  title,
  Icon,
  color,
  onPress,
  style,
  loading = false,
  disabled,
}) => {
  const handleIcon = () => {
    if (disabled && Icon && Icon.length) {
      return Icon[0]();
    }
    if (!disabled && Icon && Icon.length) {
      return Icon[1]();
    }
    if (Icon) {
      return Icon();
    }
  };

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
        <ActivityIndicator size="small" color={COLORS.textLight} />
      ) : (
        <View style={styles.content}>
          <Text size={10.5} bold color={disabled ? COLORS.textLight : color}>
            {title}
          </Text>
          {handleIcon()}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
