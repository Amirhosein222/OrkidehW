/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useIsPeriodDay } from '../../libs/hooks';

import { COLORS } from '../../configs';

const IconWithBg = ({
  width,
  height,
  bgColor,
  borderRadius,
  icon,
  iconSize,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  alignSelf,
  borderColor,
  borderWidth,
  iconColor,
  elevation,
  loading = false,
}) => {
  const IconContainer = styled.View`
    width: ${width ? width : '89px'};
    height: ${height ? height : '89px'};
    background-color: ${bgColor ? bgColor : 'white'};
    border-radius: ${borderRadius ? borderRadius : '40px'};
    border-color: ${borderColor ? borderColor : 'white'};
    border-width: ${borderWidth ? borderWidth : '0'};
    align-items: center;
    margin: ${(props) => (props.margin ? props.margin : '0px')};
    margin-top: ${marginTop ? marginTop : '0px'};
    margin-bottom: ${marginBottom ? marginBottom : '0px'};
    margin-right: ${marginRight ? marginRight : '0px'};
    margin-left: ${marginLeft ? marginLeft : '0px'};
    justify-content: center;
    align-self: ${alignSelf ? alignSelf : 'center'};
    elevation: ${elevation ? elevation : '5'};
  `;
  return (
    <IconContainer>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={useIsPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
        />
      ) : icon === 'user-alt' ? (
        <View>
          <FontAwesome5
            name={icon}
            size={iconSize}
            color={iconColor ? iconColor : COLORS.white}
          />
        </View>
      ) : (
        <View>
          <MaterialCommunityIcons
            name={icon}
            size={iconSize}
            color={iconColor ? iconColor : COLORS.white}
          />
        </View>
      )}
    </IconContainer>
  );
};

export default IconWithBg;
