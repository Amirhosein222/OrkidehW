/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../configs';

const Text = styled.Text`
  color: ${(props) => (props.color) ? props.color : COLORS.dark};
  ${({ title, large, medium, small, xl, mini }) => {
    switch (true) {
      case xl:
        return 'font-size:60px';
      case title:
        return 'font-size:28px';
      case large:
        return 'font-size: 20px';
      case medium:
          return 'font-size: 16px';
      case small:
        return 'font-size: 12px';
      case mini:
          return 'font-size: 9px';
      default:
        break;
    }
  }}
  font-family: ${(props) => props.bold ? 'Vazir-Bold' : 'Vazir'};
  align-self: ${(props) => (props.alignSelf) ? props.alignSelf : 'center'};
  text-align: ${(props) => (props.textAlign) ? props.textAlign : 'center'};
  margin:  ${(props) => (props.margin) ? props.margin : 0}px;
  margin-top:  ${(props) => (props.marginTop) ? props.marginTop : 0}px;
  margin-bottom:  ${(props) => (props.marginBottom) ? props.marginBottom : 0}px;
  margin-right:  ${(props) => (props.marginRight) ? props.marginRight : 0}px;
  margin-left:  ${(props) => (props.marginLeft) ? props.marginLeft : 0}px;
  flex-shrink: 1;
`;
export default Text;
