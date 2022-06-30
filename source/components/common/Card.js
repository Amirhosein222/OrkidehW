/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components/native';

const Card = styled.View`
  background-color: ${(props) => (props.bgColor) ? props.bgColor : ' #ffffff'};
  align-items: ${(props) => (props.alignItems) ? props.alignItems : 'center'};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'center'};
  width: ${(props) => (props.width) ? props.width : '100%'};
  height: ${(props) => (props.height) ? props.height : 50}px;
  border-radius: ${(props) => (props.borderRadius) ? props.borderRadius : 0}px;
  alignSelf: center;
  margin: 10px;
`;

export default Card;
