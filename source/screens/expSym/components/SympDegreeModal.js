/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import FormData from 'form-data';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'react-native-paper';

import { Text } from '../../../components/common';

import { useIsPeriodDay } from '../../../libs/hooks';
import getLoginClient from '../../../libs/api/loginClientApi';

import { baseUrl, COLORS, ICON_SIZE, rh, rw } from '../../../configs';
import CloseIcon from '../../../assets/icons/btns/close.svg';

const SympDegreeModal = ({
  visible,
  closeModal,
  sign,
  signDate,
  setSnackbar,
  updateMySigns,
}) => {
  const isPeriodDay = useIsPeriodDay();
  const [isSending, setIsSending] = useState(false);
  const [fetchingAllMoods, setFetchingAllMoods] = useState(true);
  const [fetchingMyMood, setFetchingMyMood] = useState(true);
  const [checkbox, setCheckbox] = useState(new Map([]));
  const moodsRef = useRef([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [allMoods, setAllMoods] = useState([]);
  const [alreadySelectedMood, setAlreadySelectedMood] = useState(0);

  const sliderValueHandler = async value => {
    setSelectedMood(allMoods[value]);
  };
  const getSymptomsMood = async function () {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('sign_id', sign.id);
    formData.append('gender', 'woman');
    loginClient.post('moods_of_sign', formData).then(response => {
      if (response.data.is_successful) {
        moodsRef.current = response.data.data.moods;
        setAllMoods(response.data.data.moods);
        setFetchingAllMoods(false);
      }
    });
  };

  const handleAlreadySelectedMood = selectedMoodId => {
    const moodIndex = moodsRef.current.findIndex(m => m.id === selectedMoodId);
    setAlreadySelectedMood(moodIndex);
  };

  const handleSelectedMood = async function (mood) {
    if (sign.is_multiple === 0) {
      setIsSending(true);
      const moodObj = {
        gender: 'woman',
        sign_id: selectedMood.sign_id,
        date: signDate,
        mood_id: [selectedMood.id],
      };
      const loginClient = await getLoginClient();
      loginClient.post('store/sign', moodObj).then(response => {
        setIsSending(false);
        if (response.data.is_successful) {
          updateMySigns();
          setSnackbar({
            msg: 'با موفقیت ثبت شد',
            visible: true,
            type: 'success',
          });
          closeModal();
        } else {
          setSnackbar({
            msg: response.data.message,
            visible: true,
          });
          closeModal();
        }
      });
    } else {
      const items = new Map([...checkbox]);
      items.set(mood.id);
      setCheckbox(items);
      const moodObj = {
        gender: 'woman',
        sign_id: mood.sign_id,
        date: signDate,
        mood_id: [mood.id],
      };
      const loginClient = await getLoginClient();
      loginClient.post('store/sign', moodObj).then(response => {
        if (response.data.is_successful) {
          updateMySigns();
          setSnackbar({
            msg: 'با موفقیت ثبت شد',
            visible: true,
            type: 'success',
          });
          closeModal();
        } else {
          setSnackbar({
            msg: response.data.message,
            visible: true,
          });
          closeModal();
        }
      });
    }
  };

  const getMyMoods = async function () {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('date', signDate);
    formData.append('gender', 'woman');
    formData.append('include_sign', 1);
    formData.append('include_mood', 1);

    loginClient.post('show/my/moods', formData).then(response => {
      setFetchingMyMood(false);
      if (response.data.is_successful) {
        const items = new Map([...checkbox]);
        if (response.data.data.length) {
          response.data.data.map(item => {
            items.set(item.mood.id);
            setCheckbox(items);
            if (item.sign_id === sign.id && sign.is_multiple === 0) {
              handleAlreadySelectedMood(item.mood.id);
            }
          });
        }
      } else {
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      }
    });
  };

  const RenderMoods = ({ item }) => {
    return (
      <View style={styles.checkBox}>
        <Text color={COLORS.dark}>{item.title}</Text>
        <Checkbox
          status={checkbox.has(item.id) ? 'checked' : 'unchecked'}
          color={isPeriodDay ? COLORS.lightRed : COLORS.lightPink}
          onPress={() => handleSelectedMood(item)}
        />
      </View>
    );
  };

  useEffect(() => {
    if (visible === true) {
      getSymptomsMood();
    }
  }, []);

  useEffect(() => {
    if (!fetchingAllMoods) {
      getMyMoods();
    }
  }, [fetchingAllMoods]);

  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.1}
      backdropTransitionOutTiming={1}
      animationOutTiming={0}
      animationInTiming={0}
      onBackdropPress={isSending ? null : () => closeModal()}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: 'white',
        }}>
        {fetchingAllMoods || fetchingMyMood ? (
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          />
        ) : (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Pressable
              onPress={isSending ? null : () => closeModal()}
              style={styles.header}>
              <CloseIcon style={ICON_SIZE} />
            </Pressable>
            <View style={styles.imageContainer}>
              <Image
                source={
                  sign.image
                    ? { uri: baseUrl + sign.image }
                    : require('../../../assets/images/icons8-heart-100.png')
                }
                style={{
                  width: sign.image ? 140 : 100,
                  height: sign.image ? 140 : 100,
                }}
                resizeMode="contain"
              />
            </View>
            <Text color={COLORS.textCommentCal} medium bold>
              میزان {sign.title} شما در این دوره
            </Text>
            {!sign.is_multiple ? (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Slider
                  style={{
                    width: rw(73),
                    height: 40,
                    marginBottom: rh(1),
                    marginTop: rh(1),
                  }}
                  value={alreadySelectedMood}
                  minimumValue={0}
                  maximumValue={allMoods.length - 1}
                  step={1}
                  onValueChange={sliderValueHandler}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#E6E6E6"
                />
                <View
                  style={{
                    flexDirection: 'row',
                    width: allMoods.length === 2 ? rw(68) : rw(87),
                    justifyContent:
                      allMoods.length === 2 ? 'space-between' : 'space-evenly',
                    paddingHorizontal: rw(2),
                  }}>
                  {!sign.is_multiple && allMoods.length
                    ? allMoods.map(m => (
                        <Text key={m.id} small color={COLORS.textLight}>
                          {m.title}
                        </Text>
                      ))
                    : null}
                </View>
                <Text color={COLORS.dark} medium bold marginTop={rh(2)}>
                  {sign.title}
                </Text>
                <Pressable
                  onPress={handleSelectedMood}
                  style={styles.submitBtn}>
                  {isSending ? (
                    <ActivityIndicator color={COLORS.primary} size="small" />
                  ) : (
                    <Text bold color={COLORS.primary}>
                      ثبت
                    </Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <FlatList
                data={allMoods}
                keyExtractor={item => item.id}
                renderItem={RenderMoods}
                style={{
                  marginTop: rh(2),
                }}
              />
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    alignSelf: 'center',
  },
  header: {
    marginTop: rh(0),
    paddingRight: rw(2.5),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalContent: {
    alignSelf: 'center',
    width: '85%',
    borderRadius: 20,
    paddingHorizontal: rw(3),
    paddingVertical: rh(2),
    elevation: 5,
    alignItems: 'center',
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: rw(1.5),
  },
  submitBtn: {
    width: rw(67),
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: rh(4),
    borderRadius: 25,
    height: rh(5.5),
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    width: rw(71),
    borderRightWidth: 3,
    borderRightColor: COLORS.icon,
    marginTop: rh(2),
  },
  icon: {
    width: 120,
    height: 120,
    backgroundColor: 'red',
  },
});

export default SympDegreeModal;
