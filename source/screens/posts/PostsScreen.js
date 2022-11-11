/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-swiper';
import RenderHtml from 'react-native-render-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Text,
  Image,
  CommentModal,
  Snackbar,
  BackgroundView,
  ScreenHeader,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, STATUS_BAR_HEIGHT, baseUrl, rh, rw } from '../../configs';

const PostsScreen = ({ navigation, route }) => {
  const isPeriodDay = useIsPeriodDay();
  const params = route.params;
  const [posts, setPosts] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getPosts = async function () {
    setIsLoading(true);
    const loginClient = await getLoginClient();
    loginClient
      .get(`index/post?category_id=${params.catId}&gender=woman`)
      .then(response => {
        setIsLoading(false);
        if (response.data.is_successful) {
          setPosts(response.data.data);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      });
  };

  const handleModal = function (postId) {
    setSelectedPostId(postId);
    setShowModal(!showModal);
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const RenderPosts = function ({ item }) {
    return (
      <View style={styles.postContainer}>
        {
          item.images ? (
            <Swiper style={styles.wrapper} showsButtons={true}>
              {item.images.map(img => {
                <Image
                  imageSource={{ uri: baseUrl + img.image }}
                  width="100%"
                  height="180px"
                  borderRadius="5px"
                />;
              })}
            </Swiper>
          ) : null
          // <Image
          //   imageSource={require('../../assets/images/01.png')}
          //   width="100%"
          //   height="180px"
          //   borderRadius="5px"
          // />
        }

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: rw(4),
            alignSelf: 'center',
            marginTop: rh(1),
            marginBottom: rh(2),
          }}>
          <Text
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
            size={12}
            black
            alignSelf="flex-end"
            marginRight="0"
            marginTop="10">
            {item.title}
          </Text>
          <RenderHtml contentWidth={rw(90)} source={{ html: item.text }} />
          {/* <Text color={COLORS.dark} medium textAlign="right" alignSelf="center">
            {item.text.replace(/(<([^>]+)>)/gi, '')}
          </Text> */}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
            paddingRight: rw(1),
            paddingBottom: rh(1),
          }}>
          <Pressable
            onPress={() => navigation.navigate('FullPost', { post: item })}
            style={{ flexDirection: 'row', margin: 5, alignSelf: 'flex-end' }}>
            <Text
              marginRight="5"
              alignSelf="flex-start"
              bold
              color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}>
              بیشتر...
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (isLoading) {
    return (
      <BackgroundView>
        <ScreenHeader title="بانک آموزشی" />

        <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          />
        </View>
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
          data={posts}
          keyExtractor={item => item.id}
          renderItem={RenderPosts}
          style={{ width: '100%', marginTop: 10 }}
        />
        <CommentModal
          visible={showModal}
          closeModal={handleModal}
          postId={selectedPostId}
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
  postContainer: {
    backgroundColor: '#f0f0f0',
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    margin: 5,
    // paddingHorizontal: rw(4)
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    marginTop: STATUS_BAR_HEIGHT + rh(0.3),
    alignItems: 'center',
  },
  commentContainer: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
    margin: 5,
  },
  commentSection: {
    backgroundColor: '#f0f0f0',
    width: '80%',
    alignSelf: 'flex-end',
    marginRight: 15,
  },
});

export default PostsScreen;
