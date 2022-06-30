/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components/native';

const RowContainer = styled.View`
  flex-direction: row;
  background-color: ${(props) => (props.bgColor ? props.bgColor : ' #fff')};
  align-items: ${(props) => (props.alignItems ? props.alignItems : 'center')};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'center'};
  width: ${(props) => (props.width ? props.width : '100%')};
  padding: ${(props) => (props.padding ? props.padding : '20px')};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 0)}px;
  margin: ${(props) => (props.margin ? props.margin : '0px')};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '0px')};
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom : '0px'};
  margin-right: ${(props) => (props.marginRight ? props.marginRight : '0px')};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : '0px')};
`;

export default RowContainer;
