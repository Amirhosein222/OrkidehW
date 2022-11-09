/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components/native';

import { COLORS } from '../../configs';
import { adjust } from '../../libs/helpers';

const Text = styled.Text`
  color: ${props => (props.color ? props.color : COLORS.textDark)};
  font-size: ${props =>
    props.size ? `${adjust(props.size)}px` : `${adjust(11.5)}px`};
  font-family: ${props =>
    props.bold
      ? 'IRANYekanMobileBold'
      : props.black
      ? 'IRANYekanMobileBlack'
      : 'IRANYekanMobileMedium'};
  align-self: ${props => (props.alignSelf ? props.alignSelf : 'center')};
  text-align: ${props => (props.textAlign ? props.textAlign : 'center')};
  margin: ${props => (props.margin ? props.margin : 0)}px;
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
  flex-shrink: 1;
`;
export default Text;
