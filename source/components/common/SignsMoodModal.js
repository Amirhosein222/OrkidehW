/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import FormData from 'form-data';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { RadioButton, Checkbox } from 'react-native-paper';

import { Text } from './index';

import { useIsPeriodDay } from '../../libs/hooks';
import getLoginClient from '../../libs/api/loginClientApi';
import { showSnackbar } from '../../libs/helpers';

import { COLORS, rh, rw } from '../../configs';

const SignsMoodModal = ({ visible, closeModal, sign, signDate }) => {
  const isPeriodDay = useIsPeriodDay();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingMyMood, setFetchingMyMood] = useState(true);
  const [choosedRadio, setChoosedRadio] = useState(false);
  const [checkbox, setCheckbox] = useState(new Map([]));
  const [moods, setMoods] = useState(null);
  const [checkedRadio, setCheckedRadio] = React.useState(null);

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

  const handleSelectedMood = async function (selectedmood) {
    setChoosedRadio(true);
    if (sign.is_multiple === 0) {
      setCheckedRadio(selectedmood.id);
      const moodObj = {
        gender: 'woman',
        sign_id: selectedmood.sign_id,
        date: signDate,
        mood_id: [selectedmood.id],
      };
      const loginClient = await getLoginClient();
      loginClient.post('store/sign', moodObj).then((response) => {
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
      items.set(selectedmood.id);
      setCheckbox(items);
      const moodObj = {
        gender: 'woman',
        sign_id: selectedmood.sign_id,
        date: signDate,
        mood_id: [selectedmood.id],
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
              setCheckedRadio(item.mood.id);
              showSnackbar('شما در این تاریخ قبلا این علامت را ثبت کرده اید!');
            } else {
              getSymptomsMood();
            }
          });
        } else {
          getSymptomsMood();
        }
      } else {
        showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
      }
    });
  };

  const RenderMoods = ({ item }) => {
    if (sign.is_multiple === 0) {
      return (
        <View style={styles.checkBox}>
          <Text color={COLORS.white}>{item.title}</Text>
          <RadioButton
            value={item.id}
            status={checkedRadio === item.id ? 'checked' : 'unchecked'}
            uncheckedColor={COLORS.dark}
            onPress={() => handleSelectedMood(item)}
            color={COLORS.white}
            disabled={choosedRadio ? true : false}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.checkBox}>
          <Text color={COLORS.white}>{item.title}</Text>
          <Checkbox
            status={checkbox.has(item.id) ? 'checked' : 'unchecked'}
            color={COLORS.white}
            onPress={() => handleSelectedMood(item)}
            disabled={choosedRadio ? true : false}
          />
        </View>
      );
    }
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
      backdropOpacity={0}
      backdropTransitionOutTiming={1}
      animationOutTiming={0}
      animationInTiming={0}
      onBackdropPress={() => closeModal()}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: isPeriodDay ? COLORS.rossoCorsa : COLORS.pink,
        }}>
        {isLoading || fetchingMyMood ? (
          <ActivityIndicator size="large" color={COLORS.white} />
        ) : (
          <View style={{ width: '100%' }}>
            <View style={styles.header}>
              <AntDesign
                onPress={() => closeModal()}
                name="closecircle"
                size={26}
                color="white"
                style={styles.closeIcon}
              />
            </View>
            <Text color="white" medium>
              لطفا انتخاب کنید
            </Text>
            <FlatList
              data={moods}
              keyExtractor={(item) => item.id}
              renderItem={RenderMoods}
              style={{ width: '100%', marginTop: 20 }}
            />
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
    backgroundColor: COLORS.pink,
    borderRadius: 20,
    height: '50%',
    justifyContent: 'center',
    elevation: 5,
    alignItems: 'center',
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
    margin: 10,
  },
  btn: { width: '40%', height: 40, margin: 20, alignSelf: 'center' },
});

export default SignsMoodModal;
