/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { useNavigation } from '@react-navigation/native';

import { rh, rw } from '../../../../configs';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';

const Slider = () => {
  const navigation = useNavigation();
  const { allSettings } = useContext(WomanInfoContext);
  const [images, setImages] = useState();
  const [sliderImages, setSliderImages] = useState([]);

  const onPress = index => {
    if (images[index].isWebView) {
      Linking.openURL(images[index].url);
    } else {
      navigation.navigate('Magazine');
    }
  };

  useEffect(() => {
    const result = [];
    const sliderResult = [];
    allSettings.forEach((s, index) => {
      if (s.key === 'app_slider[]') {
        const parsed = JSON.parse(s.value);
        result.push(parsed);
        sliderResult.push(parsed.image);
      }
    });
    setImages(result);
    setSliderImages(sliderResult);
  }, []);

  return (
    <SliderBox
      images={sliderImages}
      onCurrentImagePressed={onPress}
      dotColor="transparent"
      inactiveDotColor="transparent"
      sliderBoxHeight={rh(16.2)}
      parentWidth={rw(82.5)}
      ImageComponentStyle={{
        borderRadius: 18,
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
