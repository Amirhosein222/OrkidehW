/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Pressable,
  BackHandler,
} from 'react-native';

import { Text, BackgroundView, ScreenHeader, Button } from '..';
import { COLORS, rh, rw } from '../../../configs';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';

const DefaultImages = ({ route, navigation }) => {
  const {
    updateImage,
    isUpdating,
    setShowPictureModal,
    atEnterInfo,
    handleDefaultImage,
  } = route.params;
  const { settings } = useContext(WomanInfoContext);

  const [selectedImg, setSelectedImg] = useState('');

  const selectImages = (image) => {
    setSelectedImg(image);
  };

  const onSubmit = () => {
    if (atEnterInfo) {
      handleDefaultImage(true);
      updateImage(selectedImg);
      navigation.goBack();
      return 1;
    }
    navigation.goBack();
    updateImage(selectedImg);
  };

  const RenderImages = ({ item }) => (
    <Pressable
      onPress={() => selectImages(item)}
      style={[
        styles.imageContainer,
        selectedImg === item ? styles.imageSelected : {},
      ]}>
      <Image source={{ uri: item }} resizeMode="contain" style={styles.image} />
    </Pressable>
  );

  const backAction = () => {
    if (!isUpdating) {
      navigation.goBack();
      return true;
    }
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  useEffect(() => {
    if (selectedImg && !isUpdating) {
      navigation.goBack();
      setShowPictureModal();
    }
  }, [isUpdating]);

  return (
    <BackgroundView>
      <ScreenHeader
        title="تصاویر پیشفرض"
        customOnPress={() => navigation.goBack()}
        disableBack={isUpdating}
      />
      <View style={styles.content}>
        <Text size={16} bold>
          لطفا تصویر مورد نظر خود را انتخاب کنید
        </Text>
        {/* TODO: Fill flatlist data with settings['app_image_defaults[]'].value, which is an array */}
        <FlatList
          data={[
            settings['app_image_defaults[]'].value,
            'https://static.cdn.asset.filimo.com/vision-file/25e64741-40f0-4480-a254-8bc3cec80a77-logo.jpg',
          ]}
          numColumns={2}
          key={(item, index) => index.toString()}
          renderItem={RenderImages}
          style={styles.flatList}
          contentContainerStyle={styles.flContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Button
        title="ثبت"
        color={COLORS.primary}
        style={{ width: rw(75), marginBottom: rh(4), marginTop: 'auto' }}
        disabled={!selectedImg || isUpdating}
        loading={isUpdating}
        onPress={onSubmit}
      />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.mainBg,
    alignItems: 'center',
    width: rw(100),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(82),
    marginTop: rh(2),
    paddingBottom: rh(4),
  },
  flatList: {
    width: rw(80),
    alignSelf: 'center',
    marginBottom: rh(4),
    marginTop: rh(1),
  },
  flContainer: {
    paddingBottom: rh(6),
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    marginHorizontal: rw(6),
    marginVertical: rh(1),
    overflow: 'hidden',
  },
  imageSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 100 / 2,
  },
  image: {
    width: 90,
    height: 90,
  },
});

export default DefaultImages;
