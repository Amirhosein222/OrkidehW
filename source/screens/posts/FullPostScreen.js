/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';

import VideoPlayerModal from '../../components/learningBank/VideoPlayerModal/VideoPlayerModal';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  IconWithBg,
  Divider,
  Text,
  Image,
  CommentModal,
  TextInput,
  Snackbar,
  TabBar,
} from '../../components/common';

import {
  COLORS,
  STATUS_BAR_HEIGHT,
  WIDTH,
  SCROLL_VIEW_CONTAINER,
  baseUrl,
  rw,
} from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const FullPostScreen = ({ navigation, route }) => {
  const params = route.params;
  const isPeriodDay = useIsPeriodDay();
  const [post, setPost] = useState(null);
  const [medias, setMedias] = useState([]);

  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newComment, setNewComment] = useState(null);
  const [btnPressed, setBtnPressed] = useState(false);
  const [replyCmId, setReplyCmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getFullPost = async function () {
    const loginClient = await getLoginClient();
    loginClient
      .get(`show/post/detail?id=${params.post.id}&gender=woman`)
      .then((response) => {
        setIsLoading(false);
        if (response.data.is_successful) {
          console.log('full post ', response.data.data);
          setPost(response.data.data);
          setMedias([
            ...response.data.data[0].images,
            ...response.data.data[0].videos,
          ]);
          setComments([...response.data.data[1]]);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      });
  };

  const handleTextInput = function (text, name) {
    setNewComment(text);
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const validateComment = function () {
    if (!newComment) {
      setSnackbar({
        msg: 'لطفا ابتدا نظر خود را وارد کنید.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const sendComment = async function () {
    if (validateComment()) {
      Keyboard.dismiss();
      setBtnPressed(true);
      const formData = new FormData();
      formData.append('post_id', params.post.id);
      formData.append('post_type', 'post');
      formData.append('comment_text', newComment);
      formData.append('parent_id', '');
      formData.append('gender', 'woman');
      const loginClient = await getLoginClient();
      loginClient.post('comment/store', formData).then((response) => {
        setBtnPressed(false);
        if (response.data.is_successful) {
          setNewComment('');
          setSnackbar({
            msg: 'نظر شما با موفقیت ثبت شد.',
            visible: true,
            type: 'success',
          });
          getFullPost();
        } else {
          setSnackbar({
            msg: 'مشکلی در ثبت نظر پیش آمده است',
            visible: true,
          });
        }
      });
    }
  };

  const handleModal = function (replyCm) {
    setReplyCmId(replyCm);
    setShowModal(!showModal);
  };

  useEffect(() => {
    getFullPost();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <View
          style={{ flex: 1, width: '100%', marginTop: STATUS_BAR_HEIGHT + 5 }}>
          <Text color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink} large>
            بانک آموزشی
          </Text>
          <Divider
            width="100%"
            color={COLORS.dark}
            style={{ alignSelf: 'center' }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          />
        </View>
      </Container>
    );
  } else {
    console.log('medias ', medias);
    return (
      <Container justifyContent="flex-start">
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <IconWithBg
              bgColor={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
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

          <View style={{ flex: 1, marginRight: 20 }}>
            <Text color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink} large>
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

        <Divider width="100%" color={COLORS.dark} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[SCROLL_VIEW_CONTAINER]}>
          {post ? (
            <>
              <View style={styles.mediaContainer}>
                {post[0].images.length ? (
                  <Swiper width={WIDTH} height={200} showsButtons={true}>
                    {post[0].images.map((img) => {
                      return (
                        <Image
                          imageSource={{ uri: baseUrl + img.image }}
                          width="100%"
                          height="100%"
                        />
                      );
                    })}
                  </Swiper>
                ) : (
                  <Image
                    imageSource={require('../../assets/images/01.png')}
                    width="100%"
                    height="180px"
                  />
                )}
              </View>
              <View style={styles.textContainer}>
                <Text
                  color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
                  medium
                  alignSelf="flex-end"
                  marginTop="20">
                  {post[0].title}
                </Text>
                <Text color={COLORS.dark} medium textAlign="right">
                  {post[0].text.replace(/(<([^>]+)>)/gi, '')}
                </Text>
              </View>

              <View style={styles.commentSection}>
                {comments.map((comment) => {
                  return (
                    <View style={styles.commentContainer}>
                      <View style={styles.comment}>
                        <Pressable onPress={() => handleModal(comment.id)}>
                          <Text
                            marginRight="5"
                            marginTop="3"
                            mini
                            color={COLORS.pink}>
                            پاسخ دهید
                          </Text>
                        </Pressable>

                        <Text
                          marginRight="5"
                          color={COLORS.dark}
                          small
                          textAlign="right">
                          {comment.comment_text}
                        </Text>
                        <Text marginRight="5" color={COLORS.dark} bold small>
                          {comment.user_name}
                        </Text>
                        <Image
                          imageSource={require('../../assets/images/Ellipse.png')}
                          width="20px"
                          height="20px"
                        />
                      </View>
                      {comment.replies.map((reply) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginRight: 20,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Pressable onPress={() => handleModal(reply.id)}>
                              <Text marginRight="5" mini color={COLORS.pink}>
                                پاسخ دهید
                              </Text>
                            </Pressable>

                            <Text marginRight="5" color={COLORS.dark} small>
                              {reply.comment_text}
                            </Text>
                            <Text
                              marginRight="3"
                              color={COLORS.dark}
                              bold
                              small>
                              {reply.user_name}
                            </Text>
                            <Image
                              imageSource={require('../../assets/images/Ellipse.png')}
                              width="20px"
                              height="20px"
                            />
                            <MaterialCommunityIcons
                              name="subdirectory-arrow-left"
                              color={COLORS.grey}
                              size={20}
                              style={{ marginTop: 10 }}
                            />
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </>
          ) : null}
        </ScrollView>
        <View style={styles.commentInput}>
          {btnPressed ? (
            <ActivityIndicator size="small" color={COLORS.pink} />
          ) : (
            <Pressable onPress={() => sendComment()}>
              <Text
                marginRight="5"
                alignSelf="flex-start"
                medium
                color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
                ثبت
              </Text>
            </Pressable>
          )}

          <TextInput
            placeholder="نظر دهید..."
            style={styles.input}
            onChangeText={handleTextInput}
            editedText={newComment}
          />
        </View>
        <TabBar seperate={true} navigation={navigation} />
        {showModal ? (
          <CommentModal
            visible={showModal}
            closeModal={handleModal}
            postId={selectedPostId}
            parent_id={replyCmId}
            updateComments={getFullPost}
          />
        ) : null}

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
  mediaContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: 'red',
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: rw(5),
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    marginTop: STATUS_BAR_HEIGHT + 5,
    alignItems: 'center',
  },
  commentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    marginRight: 0,
  },
  commentSection: {
    backgroundColor: 'white',
    width: '80%',
    alignSelf: 'flex-end',
  },
  input: {
    width: '75%',
    height: 40,
    marginBottom: 10,
    borderRadius: 35,
    justifyContent: 'center',
    backgroundColor: COLORS.grey,
  },
  commentInput: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  comment: {
    flexDirection: 'row',
    margin: 10,
    width: '100%',
    justifyContent: 'flex-end',
  },
});

export default FullPostScreen;
