/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

import { RelItem } from './components';
import {
  ScreenHeader,
  Divider,
  Text,
  DeleteModal,
  Snackbar,
  BackgroundView,
} from '../../components/common';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';

import { COLORS, rh, rw } from '../../configs';
import { useApi, useIsPeriodDay } from '../../libs/hooks';
import { verifyRelation } from '../../libs/apiCalls';

import AddPerson from '../../assets/icons/drawerSettings/addNewPerson-menu.svg';
import NextIcon from '../../assets/icons/drawerSettings/nextPage.svg';

const RelationsScreen = ({ navigation }) => {
  const { relations, getAndHandleRels, fetchingRels } =
    useContext(WomanInfoContext);
  const isPeriodDay = useIsPeriodDay();

  const verificationCode = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    id: null,
  });
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [verifyCode, setVerifyCode] = useApi(() =>
    verifyRelation(verificationCode.current),
  );

  const renderRelations = function ({ item }) {
    if (item.id === 0) {
      return null;
    }
    return (
      <RelItem
        rel={item}
        handleShowDeleteModal={handleDeleteRel}
        handleVerifyRel={handleVerifyRel}
        updateRels={() => setShouldUpdate(!shouldUpdate)}
        isVerifying={
          item.verifyCode === verificationCode.current
            ? verifyCode.isFetching
            : false
        }
      />
    );
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const handleVerifyRel = async code => {
    verificationCode.current = code;
    await setVerifyCode();
  };

  useEffect(() => {
    if (verifyCode.data && verifyCode.data.is_successful) {
      setShouldUpdate(!shouldUpdate);
      setSnackbar({
        msg: 'رابطه شما با موفقیت تایید شد.',
        visible: true,
        type: 'success',
      });
    }
    if (verifyCode.data && !verifyCode.data.is_successful) {
      setSnackbar({
        msg:
          verifyCode.data.status === 404
            ? 'رابطه ای با این کد تایید ثبت نشده است.'
            : 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
    }
  }, [verifyCode]);

  const handleDeleteRel = id => {
    setShowDeleteModal({ show: true, id: id });
  };

  useEffect(() => {
    getAndHandleRels();
  }, [shouldUpdate]);

  if (fetchingRels) {
    return (
      <BackgroundView>
        <ScreenHeader title="روابط من" />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      </BackgroundView>
    );
  }
  return (
    <BackgroundView>
      <ScreenHeader title="روابط من" />
      {relations[0].id === 0 ? (
        <Text marginTop={rh(2)} marginBottom={rh(1)}>
          شما هیچ رابطه ای ثبت نکرده اید
        </Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={relations}
          keyExtractor={item => item.value.toString()}
          renderItem={renderRelations}
          style={{
            flexGrow: 0,
            marginTop: rh(2),
            marginBottom: rh(2),
          }}
        />
      )}

      <Divider
        color={COLORS.textDark}
        width={rw(81)}
        style={{
          borderBottomWidth: 0.5,
          marginTop: rh(0),
          marginBottom: rh(2),
        }}
      />

      <View style={styles.addRelContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate('AddRel', {
              handleUpdateRels: () => setShouldUpdate(!shouldUpdate),
            })
          }
          hitSlop={7}>
          <NextIcon style={{ width: 25, height: 25 }} />
        </Pressable>
        <View style={{ flexDirection: 'row' }}>
          <Text marginRight={rw(2)}>افزودن رابطه جدید</Text>
          <AddPerson style={{ width: 25, height: 25 }} />
        </View>
      </View>

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
      {showDeleteModal.show && (
        <DeleteModal
          type="rel"
          title="پارتنر"
          visible={showDeleteModal.show}
          closeModal={() => setShowDeleteModal({ show: false, id: null })}
          id={showDeleteModal.id}
          setSnackbar={setSnackbar}
        />
      )}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
    alignItems: 'center',
    width: rw(100),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    marginTop: rh(2),
    paddingBottom: rh(4),
  },
  image: {
    width: 100,
    height: 100,
    marginTop: rh(2),
  },
  addRelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: rw(82),
    marginTop: rh(1),
    marginBottom: rh(4),
  },
});

export default RelationsScreen;
