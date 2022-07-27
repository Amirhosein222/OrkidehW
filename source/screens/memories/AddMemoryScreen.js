/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
  Keyboard,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import getLoginClient from '../../libs/api/loginClientApi';
import { showSnackbar } from '../../libs/helpers';

import {
  Text,
  TextInput,
  TabBar,
  Header,
  Snackbar,
  Picker,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, STATUS_BAR_HEIGHT } from '../../configs';

const AddMemoryScreen = ({ navigation, route }) => {
  const params = route.params;
  const isFocused = useIsFocused();
  const isPeriodDay = useIsPeriodDay();
  let memory = {};
  const [title, setTitle] = useState(null);
  const [memoryText, setMemoryText] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [resetPicker, setResetPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text) {
    setMemoryText(text);
  };

  const validateInfo = function () {
    if (!title) {
      setSnackbar({
        msg: 'لطفا موضوع خاطره را انتخاب کنید.',
        visible: true,
      });
      return false;
    }
    if (!memoryText) {
      setSnackbar({
        msg: 'لطفا متن خاطره را وارد کنید.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const mergeMemoryDetails = function () {
    memory = {
      gender: 'woman',
      title: title,
      text: memoryText,
      category_id: [title],
    };
    if (params.id) {
      memory.memory_id = params.id;
    }
  };

  const addMemory = async function () {
    resetPicker && setResetPicker(false);
    Keyboard.dismiss();
    const loginClient = await getLoginClient();
    if (validateInfo()) {
      mergeMemoryDetails();
      setIsSending(true);
      loginClient.post('store/memory', memory).then((response) => {
        memory = {};
        setTitle(null);
        setMemoryText(null);
        setIsSending(false);
        setResetPicker(true);
        if (response.data.is_successful) {
          showSnackbar('با موفقیت ثبت شد', 'success');
          params.handleNewMemory();
          navigation.goBack();
        } else {
          showSnackbar('متاسفانه مشکلی پیش آمد، مجدد تلاش کنید.');
        }
      });
    }
  };

  const updateMemory = async function () {
    Keyboard.dismiss();
    const loginClient = await getLoginClient();
    if (validateInfo()) {
      mergeMemoryDetails();
      setIsSending(true);
      loginClient.post('update/memory', memory).then((response) => {
        setTitle(null);
        setMemoryText(null);
        setIsSending(false);

        if (response.data.is_successful) {
          showSnackbar('خاطره شما با موفقیت ویرایش شد.', 'success');
          params.handleNewMemory();
          navigation.goBack();
        } else {
          showSnackbar(response.data.message);
        }
      });
    }
  };

  let cats = [];
  const getCategories = async function () {
    const loginClient = await getLoginClient();
    loginClient
      .get('index/category?type=memory&gender=woman')
      .then((response) => {
        if (response.data.is_successful) {
          response.data.data.map((item) => {
            cats.push({ label: item.title, value: item.id });
          });
          handlePickerTitle(cats);
          setCategories(cats);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      });
  };

  const handlePickerTitle = function (catsss) {
    catsss.map((cat) => {
      if (cat.value === Number(params.title)) {
        setCurrentTitle(cat.value);
      }
    });
  };

  const onSelectTitle = (val) => {
    setTitle(val);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (params.edit) {
      handlePickerTitle(categories);
      setMemoryText(params.text);
      setTitle(params.title);
    } else {
      setCurrentTitle(null);
      setTitle(null);
      setMemoryText('');
    }
  }, [isFocused]);

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: '#ffffff' }}
      contentContainerStyle={{ backgroundColor: '#ffffff', flex: 1 }}>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'white',
        }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header
          navigation={navigation}
          style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
        />
        <Text
          marginTop="10"
          large
          bold
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          ثبت و ویرایش خاطره
        </Text>

        <Text marginTop="10" medium>
          موضوع خاطره
        </Text>
        {categories.length ? (
          <Picker
            data={categories}
            onItemSelect={onSelectTitle}
            placeholder={
              currentTitle ? currentTitle : 'موضوع خاطره را انتخاب کنید'
            }
            reset={resetPicker}
            defaultValue={currentTitle}
            isMemory={true}
          />
        ) : (
          <ActivityIndicator size="large" color={COLORS.pink} />
        )}

        <Text marginTop="10" medium>
          متن خاطره
        </Text>
        <TextInput
          multiline={true}
          lineNums={10}
          style={styles.textArea}
          onChangeText={handleTextInput}
          textColor="black"
          editedText={
            memoryText || memoryText === '' ? memoryText : params.text
          }
        />
        <Button
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          mode="contained"
          style={styles.btn}
          loading={isSending ? true : false}
          disabled={isSending ? true : false}
          onPress={
            params.edit === true ? () => updateMemory() : () => addMemory()
          }>
          <Text color="white">ثبت / ویرایش خاطره</Text>
        </Button>
        <TabBar seperate={true} navigation={navigation} />

        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '50%',
    height: 40,
    margin: 20,
    borderRadius: 30,
    marginBottom: 40,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 20,
    width: '80%',
    marginTop: 5,
  },
});

export default AddMemoryScreen;
