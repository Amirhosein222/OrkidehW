/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
} from 'react-native';
import moment from 'jalali-moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import getLoginClient from '../../../libs/api/loginClientApi';
import {
  saveActiveRel,
  WomanInfoContext,
} from '../../../libs/context/womanInfoContext';

import {
  BackgroundView,
  Text,
  Snackbar,
  NoRelation,
  Picker,
  ShowLovePopup,
} from '../../../components/common';

import { COLORS, rh, rw } from '../../../configs';

import nothingIcon from '../../../assets/icons/others/nothing.png';

import { ExpSympCard, ExpSympInfoModal } from '../components';
import { useIsPeriodDay } from '../../../libs/hooks';

const PartnerExpsTabScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expectations, setExpectation] = useState([]);
  const [resetPicker, setResetPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showLove, setShowLove] = useState(false);
  const womanInfo = useContext(WomanInfoContext);
  const selectedExp = useRef(null);

  const getSpouseMoodsAndExps = async function (moodDate) {
    setExpectation([]);
    setIsLoading(true);
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', womanInfo.activeRel.relId);
    formData.append('gender', 'woman');
    formData.append(
      'date',
      moment(new Date(), 'YYYY/MM/DD').locale('en').format('jYYYY/jMM/jDD'),
    );
    formData.append('include_sign', 1);
    formData.append('include_mood', 1);
    formData.append('include_expectation', 1);
    loginClient
      .post('show/spouse/moods/and/expectation', formData)
      .then(response => {
        setIsRefreshing(false);
        setIsLoading(false);
        if (response.data.is_successful) {
          setExpectation(response.data.data.expects);
        } else {
          setSnackbar({
            msg: response.data.message.hasOwnProperty('relation_id')
              ? response.data.message.relation_id
              : response.data.message,
            visible: true,
          });
        }
      });
  };

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    getSpouseMoodsAndExps();
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const setActiveSpouse = async function (value) {
    if (typeof value === 'object') {
      return true;
    }
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', value);
    formData.append('gender', 'woman');
    loginClient.post('active/relation', formData).then(response => {
      if (response.data.is_successful) {
        AsyncStorage.setItem(
          'lastActiveRelId',
          JSON.stringify(response.data.data.id),
        );
        saveActiveRel({
          relId: response.data.data.id,
          label: response.data.data.man_name,
          image: response.data.data.man_image,
          mobile: response.data.data.man.mobile,
          birthday: response.data.data.man.birth_date,
        });
        setSnackbar({
          msg: 'این رابطه به عنوان رابطه فعال شما ثبت شد.',
          visible: true,
          type: 'success',
        });
      } else {
        setResetPicker(!resetPicker);
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };

  const onSelectSpouse = spouse => {
    if (spouse === 'newRel') {
      setResetPicker(!resetPicker);
      return navigation.navigate('AddRel', {
        handleUpdateRels: womanInfo.getAndHandleRels,
        showSnackbar: setSnackbar,
      });
    }
    setActiveSpouse(spouse);
  };

  const openInfoModal = exp => {
    selectedExp.current = exp;
    setShowInfoModal(true);
  };

  const RenderExpectations = ({ item }) => {
    return <ExpSympCard item={item} type="exp" onReadMore={openInfoModal} />;
  };

  useEffect(() => {
    if (womanInfo.activeRel) {
      getSpouseMoodsAndExps();
    }
  }, [womanInfo.activeRel]);

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.topContent}>
        {womanInfo.relations.length && womanInfo.activeRel ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            {expectations.length ? (
              <FlatList
                data={expectations}
                onRefresh={onRefresh}
                refreshing={isRefreshing}
                keyExtractor={item => String(item.id)}
                numColumns={2}
                renderItem={RenderExpectations}
              />
            ) : isLoading ? (
              <View>
                <ActivityIndicator
                  size="large"
                  color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
                />
              </View>
            ) : (
              <View style={styles.noMood}>
                <Image
                  source={nothingIcon}
                  style={{
                    width: rw(52),
                  }}
                  resizeMode="contain"
                />
                <Text bold size={13} color={COLORS.textLight}>
                  دلبر شما امروز چیزی رو ثبت نکرده!
                </Text>
                <Pressable onPress={getSpouseMoodsAndExps}>
                  <Ionicons
                    name="md-refresh"
                    size={26}
                    style={{ marginTop: rh(2) }}
                  />
                </Pressable>
              </View>
            )}
          </View>
        ) : womanInfo.relations.length && !womanInfo.activeRel ? (
          <View style={styles.noRel}>
            <Text color={COLORS.red}>رابطه فعال خود را انتخاب کنید</Text>
            <Picker
              data={womanInfo.relations}
              onItemSelect={onSelectSpouse}
              reset={resetPicker}
              placeholder="انتخاب رابطه"
            />
          </View>
        ) : (
          <NoRelation navigation={navigation} />
        )}
      </View>

      {selectedExp.current && (
        <ExpSympInfoModal
          visible={showInfoModal}
          closeModal={() => setShowInfoModal(false)}
          item={selectedExp.current}
          setSnackbar={setSnackbar}
          isExp={true}
        />
      )}

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
      {showLove ? (
        <ShowLovePopup handleVisible={() => setShowLove(false)} />
      ) : null}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  noRel: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  topContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
  },
  noMood: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
    bottom: rh(4),
  },
});

export default PartnerExpsTabScreen;
