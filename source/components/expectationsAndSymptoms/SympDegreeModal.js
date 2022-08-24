/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'react-native-paper';

import { Text } from '../common/index';

import { useIsPeriodDay } from '../../libs/hooks';
import getLoginClient from '../../libs/api/loginClientApi';
import { showSnackbar } from '../../libs/helpers';

import { baseUrl, COLORS, rh, rw } from '../../configs';

const SympDegreeModal = ({ visible, closeModal, sign, signDate }) => {
  const isPeriodDay = useIsPeriodDay();
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [fetchingMyMood, setFetchingMyMood] = useState(true);
  const [choosedRadio, setChoosedRadio] = useState(false);
  const [checkbox, setCheckbox] = useState(new Map([]));
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = React.useState(null);

  const sliderValueHandler = async (value) => {
    setSelectedMood(moods[value]);
  };
  const getSymptomsMood = async function () {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('sign_id', sign.id);
    formData.append('gender', 'woman');
    loginClient.post('moods_of_sign', formData).then((response) => {
      setIsLoading(false);
      if (response.data.is_successful) {
        setMoods(response.data.data.moods);
      }
    });
  };

  const handleSelectedMood = async function (mood) {
    setChoosedRadio(true);
    if (sign.is_multiple === 0) {
      setIsSending(true);
      const moodObj = {
        gender: 'woman',
        sign_id: selectedMood.sign_id,
        date: signDate,
        mood_id: [selectedMood.id],
      };
      const loginClient = await getLoginClient();
      loginClient.post('store/sign', moodObj).then((response) => {
        setIsSending(false);

        setChoosedRadio(false);
        if (response.data.is_successful) {
          showSnackbar('با موفقیت ثبت شد', 'success');
          closeModal();
        } else {
          showSnackbar(response.data.message);
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
      loginClient.post('store/sign', moodObj).then((response) => {
        setChoosedRadio(false);
        if (response.data.is_successful) {
          showSnackbar('با موفقیت ثبت شد', 'success');
        } else {
          showSnackbar(response.data.message);
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

    loginClient.post('show/my/moods', formData).then((response) => {
      setFetchingMyMood(false);
      if (response.data.is_successful) {
        const items = new Map([...checkbox]);
        if (response.data.data.length) {
          response.data.data.map((item) => {
            items.set(item.mood.id);
            setCheckbox(items);
            if (item.sign_id === sign.id && sign.is_multiple === 0) {
              setChoosedRadio(true);
              showSnackbar('شما در این تاریخ این علامت را ثبت کرده اید!');
              closeModal();
            } else {
              getSymptomsMood();
            }
          });
        } else {
          getSymptomsMood();
        }
      } else {
        showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
        closeModal();
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
          disabled={choosedRadio ? true : false}
        />
      </View>
    );
  };

  useEffect(() => {
    if (visible === true) {
      getMyMoods();
    }
  }, []);

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
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: 'white',
        }}>
        {isLoading || fetchingMyMood ? (
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          />
        ) : (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.header}>
              <AntDesign
                onPress={isSending ? null : () => closeModal()}
                name="close"
                size={26}
                color={COLORS.expSympTitle}
                style={styles.closeIcon}
              />
            </View>
            <Image
              source={
                sign.image
                  ? { uri: baseUrl + sign.image }
                  : require('../../assets/images/icons8-heart-100.png')
              }
              style={styles.icon}
            />
            <Text color={COLORS.dark} large bold>
              {sign.title}
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
                    width: rw(82),
                    height: 40,
                    marginBottom: rh(1),
                    marginTop: rh(1),
                  }}
                  minimumValue={0}
                  maximumValue={moods.length - 1}
                  step={1}
                  onValueChange={sliderValueHandler}
                  minimumTrackTintColor={COLORS.expSympTitle}
                  maximumTrackTintColor="#000000"
                  thumbTintColor={COLORS.expSympTitle}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    width: rw(80),
                    justifyContent: 'space-between',
                    paddingHorizontal: rw(2),
                  }}>
                  {!sign.is_multiple && moods.length
                    ? moods.map((m) => <Text key={m.id}>{m.title}</Text>)
                    : null}
                </View>
                <Pressable
                  onPress={handleSelectedMood}
                  disabled={choosedRadio}
                  style={styles.submitBtn}>
                  {isSending ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text color="white">ثبت</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <FlatList
                data={moods}
                keyExtractor={(item) => item.id}
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
  },
  header: {
    marginTop: rh(0),
    paddingRight: rw(5),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    // height: '50%',
    justifyContent: 'center',
    elevation: 5,
    alignItems: 'center',
    paddingVertical: rh(2),
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: rw(1.5),
  },
  submitBtn: {
    width: '40%',
    backgroundColor: COLORS.expSympTitle,
    marginTop: rh(4),
    borderRadius: 20,
    height: 35,
    justifyContent: 'center',
  },
});

export default SympDegreeModal;
