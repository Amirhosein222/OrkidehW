/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { SliderBox } from 'react-native-image-slider-box';

import { rh, rw } from '../../../../configs';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';

const images = [
  require('../../../../assets/images/1.jpg'),
  require('../../../../assets/images/2.jpg'),
];

const Slider = () => {
  const { settings } = useContext(WomanInfoContext);

  const onPress = index => {
    console.log('index ', index);
  };

  return (
    <SliderBox
      images={images}
      onCurrentImagePressed={onPress}
      dotColor="transparent"
      inactiveDotColor="transparent"
      sliderBoxHeight={rh(18)}
      parentWidth={rw(82.5)}
      ImageComponentStyle={{
        borderRadius: 16,
        marginTop: rh(2),
      }}
      paginationBoxStyle={{
        position: 'relative',
      }}
      autoplay
      circleLoop={false}
    />
  );
};

export default Slider;
