/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';

import getLoginClient from '../../../libs/api/loginClientApi';

import {
  Text,
  Snackbar,
  BackgroundView,
  ScreenHeader,
} from '../../../components/common';

import { useIsPeriodDay } from '../../../libs/hooks';
import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../../configs';

const LearningBankScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getCategories = async function () {
    setIsLoading(true);
    const loginClient = await getLoginClient();
    loginClient.get('index/category?type=post&gender=woman').then(response => {
      setIsLoading(false);
      if (response.data.is_successful) {
        setCategories(response.data.data);
      } else {
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      }
    });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const RenderCategories = function ({ item }) {
    return (
      <Pressable
        onPress={() => navigation.navigate('Posts', { catId: item.id })}
        style={styles.imgContainer}>
        {item?.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../../assets/images/09.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <View style={styles.overlayText}>
          <Text medium bold color={COLORS.white}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    getCategories();
  }, []);

  if (isLoading) {
    return (
      <BackgroundView>
        <ScreenHeader title="بانک آموزشی" />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      </BackgroundView>
    );
  } else {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ScreenHeader title="بانک آموزشی" />

        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={RenderCategories}
          style={{ width: '100%', marginTop: 10 }}
        />
        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
        {/* //<Pressable
            //   onPress={() => navigation.navigate('ArticleScreen')}
            //   style={styles.imgContainer}>
            //   <Image
            //     imageSource={require('../../assets/images/06.png')}
            //     width="90%"
            //     height="120px"
            //     borderRadius="10px"
            //     marginTop="10px"
            //   />
            //   <View style={styles.overlayText}>
            //     <Text medium color={COLORS.white}>
            //       تصویر
            //     </Text>
            //   </View>
            // </Pressable>

            // <RowContainer justifyContent="space-between">
            //   <Image
            //     imageSource={require('../../assets/images/02.png')}
            //     width="45%"
            //     height="120px"
            //     borderRadius="10px"
            //   />
            //   <Image
            //     imageSource={require('../../assets/images/04.png')}
            //     width="45%"
            //     height="120px"
            //     borderRadius="10px"
            //   />
            // </RowContainer>

            // <Pressable
            //   onPress={() => navigation.navigate('ArticleScreen')}
            //   style={styles.imgContainer}>
            //   <Image
            //     imageSource={require('../../assets/images/03.png')}
            //     width="90%"
            //     height="120px"
            //     borderRadius="10px"
            //   />
            //   <View style={styles.overlayText}>
            //     <Text medium color={COLORS.white}>
            //       ویدیو
            //     </Text>
            //   </View>
            // </Pressable>

            // <RowContainer justifyContent="space-between">
            //   <Image
            //     imageSource={require('../../assets/images/08.png')}
            //     width="45%"
            //     height="120px"
            //     borderRadius="10px"
            //   />
            //   <Image
            //     imageSource={require('../../assets/images/07.png')}
            //     width="45%"
            //     height="120px"
            //     borderRadius="10px"
            //   />
            // </RowContainer> */}
      </BackgroundView>
    );
  }
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    marginTop: STATUS_BAR_HEIGHT + rh(1.4),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  image: { width: rw(90), height: rh(14), borderRadius: 5, marginTop: rh(4) },
  imgContainer: {
    width: '100%',
    alignItems: 'center',
  },
  overlayText: {
    ...StyleSheet.absoluteFillObject,
    left: rw(62),
    top: rh(13.5),
  },
});

export default LearningBankScreen;
