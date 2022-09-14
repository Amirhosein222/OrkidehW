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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  IconWithBg,
  Divider,
  Text,
  Image,
  CommentModal,
  Snackbar,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, STATUS_BAR_HEIGHT, baseUrl, rh, rw } from '../../configs';
import { numberConverter } from '../../libs/helpers';

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
      .then((response) => {
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
              {item.images.map((img) => {
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
            medium
            alignSelf="flex-end"
            marginRight="0"
            marginTop="10">
            {numberConverter(item.title)}
          </Text>
          <Text color={COLORS.dark} medium textAlign="right" alignSelf="center">
            {numberConverter(item.text.replace(/(<([^>]+)>)/gi, ''))}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Pressable
            onPress={() => navigation.navigate('FullPost', { post: item })}
            style={{ flexDirection: 'row', margin: 5, alignSelf: 'flex-end' }}>
            <Text
              marginRight="5"
              alignSelf="flex-start"
              color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}>
              بیشتر...
            </Text>
          </Pressable>
          <View style={styles.commentSection}>
            <View style={styles.commentContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text marginRight="5" color={COLORS.dark} small>
                  نگار قاسمی
                </Text>
                <Image
                  imageSource={require('../../assets/images/Ellipse.png')}
                  width="20px"
                  height="20px"
                />
              </View>
              <Text marginRight="10" small>
                کامنت کامنت
              </Text>
            </View>
            <View style={styles.commentContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text marginRight="5" color={COLORS.dark} small>
                  نگار قاسمی
                </Text>
                <Image
                  imageSource={require('../../assets/images/Ellipse.png')}
                  width="20px"
                  height="20px"
                />
              </View>
              <Text marginRight="10" small>
                کامنت کامنت
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            width: '100%',
            marginTop: STATUS_BAR_HEIGHT + rh(2.2),
          }}>
          <Text
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
            large
            bold>
            بانک آموزشی
          </Text>
          <Divider
            width="100%"
            color={COLORS.dark}
            style={{ alignSelf: 'center', marginTop: rh(1) }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          />
        </View>
      </Container>
    );
  } else {
    return (
      <Container justifyContent="flex-start">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <IconWithBg
              bgColor={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
              width="40px"
              height="40px"
              borderRadius="20px"
              icon="chevron-left"
              iconSize={30}
              marginTop="20px"
              marginLeft="10px"
              marginBottom="10px"
              alignSelf="flex-start"
            />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text
              color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
              large
              marginRight={rh(2)}
              bold>
              بانک آموزشی
            </Text>
          </View>
          <Pressable onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons
              name="menu"
              color={COLORS.grey}
              size={28}
              style={{ marginRight: 10 }}
            />
          </Pressable>
        </View>

        <Divider
          width="100%"
          color={COLORS.dark}
          // style={{ marginTop: rh(1) }}
        />
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
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
      </Container>
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
