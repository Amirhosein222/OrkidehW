import React from 'react';
import styled from 'styled-components/native';

const Button = styled.Button`
  background-color: ${(props) => props.color};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  align-items: center;
  justify-content: center;
`;

export default Button;
