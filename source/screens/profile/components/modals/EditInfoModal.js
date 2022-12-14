/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment-jalaali';

import { Button, Text, InputRow } from '../../../../components/common';
import { rw, rh, COLORS, ICON_SIZE } from '../../../../configs';
import getLoginClient from '../../../../libs/api/loginClientApi';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';

import Close from '../../../../assets/icons/btns/close.svg';
import EnableCheck from '../../../../assets/icons/btns/enabled-check.svg';
import { useIsPeriodDay } from '../../../../libs/hooks';

const EditInfoModal = ({
  title,
  visible,
  closeModal,
  displayName,
  oldName,
  setSnackbar,
}) => {
  const isPeriodDay = useIsPeriodDay();

  const { fullInfo, saveFullInfo } = useContext(WomanInfoContext);
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setName(oldName);
    setUsername(displayName);

    return () => {
      setName();
      setUsername();
      setShowError(false);
    };
  }, []);

  const validateNames = () => {
    if (!name || !username) {
      return setShowError(true);
    }
    if (title === 'نام' && name === oldName) {
      return closeModal();
    }
    if (title === 'نام نمایشی' && username === displayName) {
      return closeModal();
    }
    return true;
  };

  const updateName = async function () {
    if (validateNames() === true) {
      const loginClient = await getLoginClient();
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('display_name', username);
      formData.append('name', name);
      formData.append(
        'birth_date',
        moment(fullInfo.birth_date, 'X').locale('en').format('jYYYY/jMM/jDD'),
      );
      formData.append('gender', 'woman');
      formData.append(
        'is_password_active',
        Number(fullInfo.is_password_active),
      );
      formData.append('is_finger_active', Number(fullInfo.is_finger_active));
      formData.append('password', fullInfo.password);
      formData.append('repeat_password', fullInfo.password);
      loginClient
        .post('complete/profile', formData)
        .then(response => {
          setIsUpdating(false);
          if (response.data.is_successful) {
            saveFullInfo(response.data.data);
            setSnackbar({
              msg: 'اطلاعات شما با موفقیت ویرایش شد',
              visible: true,
              type: 'success',
            });
            closeModal();
          } else {
            setSnackbar({
              msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
              visible: true,
            });
          }
        })
        .catch(e => {
          // console.log(e);
        });
    }
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      coverScreen={true}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={0}
      animationOutTiming={0}
      animationInTiming={0}
      animationIn="slideInUp"
      onBackdropPress={isUpdating ? null : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ width: rw(11) }} />
          <Text color={COLORS.textCommentCal} bold size={14}>
            {title} خود را وارد کنید
          </Text>
          <Pressable onPress={isUpdating ? null : closeModal} hitSlop={7}>
            <Close style={{ ...ICON_SIZE, marginRight: rw(5) }} />
          </Pressable>
        </View>
        <View style={{ marginTop: rh(6) }}>
          {title === 'نام' ? (
            <InputRow
              title="نام :"
              placeholder="نام خود را اینجا وارد کنید"
              handleTextInput={setName}
              name="name"
              containerStyle={styles.input}
              editedText={name}
              required={showError}
              tipText="وارد کردن نام الزامی است"
            />
          ) : (
            <InputRow
              title="نام نمایشی"
              placeholder="نام نمایشی خود را اینجا وارد کنید"
              handleTextInput={setUsername}
              name="username"
              containerStyle={styles.input}
              editedText={username}
              required={showError}
              tipText=" وارد کردن نام نمایشی الزامی است"
            />
          )}
        </View>

        <Button
          title="تایید اطلاعات"
          Icon={() => <EnableCheck style={ICON_SIZE} />}
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          disabled={isUpdating}
          loading={isUpdating}
          onPress={updateName}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  content: {
    alignItems: 'center',
    width: rw(100),
    height: rh(50),
    marginTop: 'auto',
    elevation: 5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: rh(2),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
  row: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: rh(2.5),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textDark,
    paddingBottom: rh(2),
  },
  input: {
    marginTop: rh(2),
  },
});
export default EditInfoModal;
