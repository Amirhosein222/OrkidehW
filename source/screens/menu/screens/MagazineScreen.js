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

const MagazineScreen = ({ navigation }) => {
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
        <ScreenHeader title="مجله" />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
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
        <ScreenHeader title="مجله" />

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

export default MagazineScreen;
