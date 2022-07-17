import React from 'react';
import styled from 'styled-components/native';

const Image = ({
  imageSource,
  width,
  height,
  margin,
  borderRadius,
  marginTop,
  marginLeft,
  alignSelf,
}) => {
  const StyledImage = styled.Image`
    width: ${width};
    height: ${height};
    margin: ${margin ? margin : '0px'};
    margin-top: ${marginTop ? marginTop : '0px'};
    margin_left: ${marginLeft ? marginLeft : '0px'};
    border-radius: ${borderRadius ? borderRadius : '0px'};
    align-self: ${alignSelf ? alignSelf : 'center'};
  `;
  return <StyledImage source={imageSource} />;
};

export default Image;
