/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FormData from 'form-data';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';

import { useIsPeriodDay } from '../../libs/hooks';
import getLoginClient from '../../libs/api/loginClientApi';
import {
  saveWomanRelations,
  saveActiveRel,
} from '../../libs/context/womanInfoContext';
import { validatePhoneNumber, numberConverter } from '../../libs/helpers';
import {
  Container,
  Text,
  Divider,
  TextInput,
  Header,
  Card,
  TabBar,
  UpdateModal,
  Snackbar,
} from '../../components/common';
import {
  WIDTH,
  SCROLL_VIEW_CONTAINER,
  COLORS,
  STATUS_BAR_HEIGHT,
  rh,
} from '../../configs';

const ContactSpouseScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [spouseName, setSpouseName] = useState('');
  const [spouseNumber, setSpouseNumber] = useState('');
  const [spousePicture, setSpousePicture] = useState('');
  const [relations, setRelations] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState({ id: null, deleting: false });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState({
    id: null,
    verifying: false,
  });
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [toBeUpdated, setToBeUpdated] = useState(null);
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text, name) {
    switch (name) {
      case 'spouseName':
        setSpouseName(text);
        break;
      case 'spouseNumber':
        setSpouseNumber(text);
        break;
      default:
        break;
    }
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const selectPicture = function (remove = false) {
    if (remove) {
      setSpousePicture(null);
      return;
    }
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then((image) => {
      setSpousePicture(image.path);
      setSnackbar({
        msg: 'تصویر پروفایل با موفقیت انتخاب شد.',
        visible: true,
        type: 'success',
      });
    });
  };

  const verifyInfo = function () {
    if (!spouseName || !spouseNumber) {
      setSnackbar({
        msg: 'فیلد های نام و شماره تلفن همراه الزامی می باشند!',
        visible: true,
      });
      return false;
    }
    if (!validatePhoneNumber(spouseNumber)) {
      setSnackbar({
        msg: 'فرمت تلفن همراه معتبر نیست.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const addRelation = async function () {
    if (verifyInfo()) {
      const loginClient = await getLoginClient();
      setIsAdding(true);
      const formData = new FormData();
      formData.append('mobile', spouseNumber);
      if (spousePicture) {
        formData.append('man_image', {
          uri: spousePicture,
          name: 'spouseImg.png',
          type: 'image/png',
        });
      }
      formData.append('man_name', spouseName);
      formData.append('include_man', 1);
      formData.append('include_woman', 1);
      formData.append('gender', 'woman');
      loginClient
        .post('store/relation', formData)
        .then((response) => {
          setIsAdding(false);
          if (response.data.is_successful) {
            setSnackbar({
              msg: 'اطلاعات همسر شما با موفقیت ثبت شد.',
              visible: true,
              type: 'success',
            });
            setSpouseName('');
            setSpouseNumber('');
            setSpousePicture('');
            setShouldUpdate(!shouldUpdate);
          } else {
            setSnackbar({
              msg: response.data.message,
              visible: true,
            });
          }
        })
        .catch((e) => {
          setIsAdding(false);
          // console.log('Error at Adding Spouse ', e.response.data);
        });
    }
  };

  const updateRelation = function (relation, getRels = false) {
    if (getRels === true) {
      setUpdateModal(!updateModal);
      getRelations();
      return;
    }
    setToBeUpdated(relation);
    setUpdateModal(!updateModal);
  };

  const handleRelation = async function (task, id) {
    const loginClient = await getLoginClient();
    if (task === 'delete') {
      setIsDeleting({ id: id, deleting: true });
      const formData = new FormData();
      formData.append('gender', 'woman');
      formData.append('relation_id', id);
      loginClient.post('delete/relation', formData).then((response) => {
        setIsDeleting(false);
        if (response.data.is_successful) {
          setShouldUpdate(!shouldUpdate);
          setSnackbar({
            msg: 'رابطه شما با موفقیت حذف شد.',
            visible: true,
            type: 'success',
          });
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی رخ داده است.',
            visible: true,
          });
        }
      });
    }
    if (task === 'update') {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('relation_id', id);
      formData.append('gender', 'woman');
      formData.append('display_name_for_spouse', spouseName);
      formData.append('display_image_for_spouse', spouseName);
      loginClient.post('update/relation', formData).then((response) => {
        setIsUpdating(false);
      });
    }

    if (task === 'verify') {
      setIsVerifying({ id: id, verifying: true });
      const formData = new FormData();
      formData.append('relation_id', id);
      formData.append('gender', 'woman');
      loginClient.post('verify/relation', formData).then((response) => {
        setIsVerifying(false);
        if (response.data.is_successful) {
          setShouldUpdate(!shouldUpdate);
          setSnackbar({
            msg: 'رابطه شما با موفقیت تایید شد.',
            visible: true,
            type: 'success',
          });
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی رخ داده است.',
            visible: true,
          });
        }
      });
    }
  };

  const getRelations = async function () {
    const lastActiveRel = await AsyncStorage.getItem('lastActiveRelId');

    saveActiveRel(null);
    setLoadingRelations(true);
    const loginClient = await getLoginClient();
    loginClient
      .get('index/relation?include_man=1&include_woman=1&gender=woman')
      .then((response) => {
        setLoadingRelations(false);
        if (response.data.is_successful) {
          let rels = [];
          let activeRel = null;
          setRelations(response.data.data);
          response.data.data.map((rel) => {
            rels.push({
              label: rel.man_name ? rel.man_name : 'بدون نام',
              value: rel.id,
              is_active: rel.is_active,
              is_verified: rel.is_verified,
            });
            if (rel.is_active === 1 && rel.id === Number(lastActiveRel)) {
              activeRel = rel;
            }
          });
          if (activeRel) {
            saveActiveRel({
              relId: activeRel.id,
              label: activeRel.man_name,
              image: activeRel.man_image,
              mobile: activeRel.man.mobile,
            });
          }
          AsyncStorage.setItem('rels', JSON.stringify(rels));
          saveWomanRelations(rels);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      });
  };

  const copyToClipboard = (code) => {
    Clipboard.setString(code);
    setSnackbar({
      msg: 'کد تایید کپی شد.',
      visible: true,
      type: 'success',
    });
  };

  const renderRelations = function ({ item }) {
    return (
      <Card
        width="80%"
        height="150"
        bgColor={isPeriodDay ? COLORS.lightRed : COLORS.lightPink}
        borderRadius="10">
        <View style={styles.cardContent}>
          <Button
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
            mode="contained"
            style={styles.cardBtn}
            disabled={isAdding || isDeleting.deleting}
            loading={
              isDeleting.deleting && isDeleting.id === item.id ? true : false
            }
            onPress={() => handleRelation('delete', item.id)}>
            <Text small color="white">
              حذف
            </Text>
          </Button>
          <Text bold marginRight="10">
            {item.man_name}
          </Text>
        </View>

        <View style={styles.cardContent}>
          <Button
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
            mode="contained"
            style={styles.cardBtn}
            disabled={isAdding || isDeleting.deleting}
            loading={isUpdating ? true : false}
            onPress={() => updateRelation(item)}>
            <Text small color="white">
              ویرایش
            </Text>
          </Button>
          <Text marginRight="10">{numberConverter(item.man.mobile)}</Text>
        </View>

        <Pressable
          style={[
            styles.cardBtn,
            {
              margin: 5,
              height: 50,
              width: '90%',
              alignSelf: 'center',
              backgroundColor: COLORS.dark,
            },
          ]}
          onPress={() => copyToClipboard(item.verification_code)}>
          <View>
            <Text small color="white">
              کپی کد تایید (تست)
            </Text>
            <Text color="white">{item.verification_code}</Text>
          </View>
        </Pressable>
      </Card>
    );
  };

  useEffect(() => {
    getRelations();
  }, [shouldUpdate]);

  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
      />
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={SCROLL_VIEW_CONTAINER}>
        <Text marginTop="20" medium bold>
          ارتباط با همسر
        </Text>
        <Divider
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          width="90%"
          style={{ marginTop: 10 }}
        />
        <Text marginTop="20" medium bold>
          نام همسر
        </Text>
        <TextInput
          style={{
            ...styles.input,
            backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
          }}
          onChangeText={handleTextInput}
          inputName="spouseName"
          editedText={spouseName}
          textColor={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          phColor={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
        />
        <Text marginTop="20" medium bold>
          شماره موبایل همسر
        </Text>
        <TextInput
          style={{
            ...styles.input,
            backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
          }}
          keyboardType="numeric"
          onChangeText={handleTextInput}
          inputName="spouseNumber"
          editedText={spouseNumber}
          textColor={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          phColor={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
        />

        {spousePicture ? (
          <Pressable
            onPress={() => selectPicture(true)}
            style={{ marginTop: 20, alignItems: 'center' }}>
            <Text
              color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
              medium>
              حذف تصویر پروفایل
            </Text>
            <View style={styles.userIcon}>
              <Image
                source={{ uri: spousePicture }}
                style={{
                  height: 90,
                  width: 90,
                }}
              />
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => selectPicture()}
            style={{ marginTop: 20, alignItems: 'center' }}>
            <Text color={COLORS.dark} medium>
              انتخاب تصویر پروفایل
            </Text>
            <View
              style={{
                ...styles.userIcon,
                backgroundColor: isPeriodDay
                  ? COLORS.lightRed
                  : COLORS.lightPink,
              }}>
              <Icon name="user-alt" size={40} color={COLORS.white} />
            </View>
          </Pressable>
        )}

        <Button
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          mode="contained"
          style={[styles.btn, { width: '25%', height: 40, margin: 20 }]}
          loading={isAdding}
          disabled={isAdding || isDeleting.deleting}
          onPress={() => addRelation()}>
          <Text color="white">ثبت</Text>
        </Button>

        <Divider
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          width="90%"
        />

        <Text marginTop="20" medium bold>
          لیست شماره ها
        </Text>
        {loadingRelations === false ? (
          <FlatList
            data={relations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRelations}
            style={{ width: '100%' }}
          />
        ) : (
          <ActivityIndicator
            size="small"
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
            style={{ marginTop: rh(1) }}
          />
        )}
      </ScrollView>

      {toBeUpdated ? (
        <UpdateModal
          visible={updateModal}
          closeModal={updateRelation}
          relation={toBeUpdated}
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
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: 250,
  },
  switchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  btn: {
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 20,
  },
  cardContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  cardBtn: {
    width: '30%',
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    marginLeft: 5,
  },
  userIcon: {
    width: 89,
    height: 89,
    backgroundColor: COLORS.lightPink,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    width: '75%',
    marginTop: 10,
  },
});

export default ContactSpouseScreen;
