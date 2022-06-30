import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => (props.bgColor ? props.bgColor : ' #ffffff')};
  align-items: center;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '0px')};
  width: 100%;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'center'};
`;

export default Container;
