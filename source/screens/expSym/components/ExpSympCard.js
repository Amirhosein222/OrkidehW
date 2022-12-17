/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { deleteSignApi, deleteExpApi } from '../apis';
import { baseUrl, COLORS } from '../../../configs';
import { rw, rh } from '../../../configs';
import { useApi, useIsPeriodDay } from '../../../libs/hooks';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { adjust } from '../../../libs/helpers';

const ExpSympCard = ({
  item,
  onPress,
  isExp = false,
  selectedExp = {},
  alreadySelected,
  setSnackbar,
  updateData,
}) => {
  const isPeriodDay = useIsPeriodDay();
  const { activeRel } = useContext(WomanInfoContext);
  const [deleteExp, setDeleteExp] = useApi(() =>
    deleteExpApi(alreadySelected.id, activeRel.relId),
  );
  const [deleteSign, setDeleteSign] = useApi(() =>
    deleteSignApi(alreadySelected.id),
  );
  const onDelete = () => {
    if (isExp) {
      setDeleteExp();
    } else {
      setDeleteSign();
    }
  };

  useEffect(() => {
    if (deleteExp.data && deleteExp.data.is_successful) {
      setSnackbar({
        msg: 'با موفقیت حذف شد',
        visible: true,
        type: 'success',
      });
      updateData();
    }
    deleteExp.data &&
      !deleteExp.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [deleteExp]);

  useEffect(() => {
    if (deleteSign.data && deleteSign.data.is_successful) {
      updateData();
      setSnackbar({
        msg: 'با موفقیت حذف شد',
        visible: true,
        type: 'success',
      });
    }
    deleteSign.data &&
      !deleteSign.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [deleteSign]);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: alreadySelected ? COLORS.lightPink : COLORS.cardBg,
      }}>
      {alreadySelected && (
        <Pressable
          disabled={deleteExp.isFetching || deleteSign.isFetching}
          style={styles.selectedBadge}
          onPress={onDelete}>
          {deleteExp.isFetching || deleteSign.isFetching ? (
            <View
              style={[
                styles.deleteActivity,
                {
                  backgroundColor: isPeriodDay
                    ? COLORS.periodDay
                    : COLORS.primary,
                },
              ]}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <AntDesign
              name="closecircle"
              color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
              size={32}
            />
          )}
        </Pressable>
      )}

      <Pressable onPress={() => onPress(item)}>
        {selectedExp.id === item.id && selectedExp.isStoring ? (
          <View style={{ height: 128, justifyContent: 'center' }}>
            <ActivityIndicator
              size="large"
              color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
            />
          </View>
        ) : (
          <Image
            source={
              item.image
                ? { uri: baseUrl + item.image }
                : require('../../../assets/images/icons8-heart-100.png')
            }
            style={styles.icon}
            resizeMode="contain"
          />
        )}
      </Pressable>

      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.text,
            { color: COLORS.textCommentCal, fontSize: adjust(9.5) },
          ]}>
          {item.title}
        </Text>
        {alreadySelected && !isExp ? (
          <View style={styles.degreeContainer}>
            <Text
              style={[
                styles.text,
                { color: COLORS.textLight, fontSize: 10.5 },
              ]}>
              میزان {item.title} امروز شما :{' '}
              <Text
                style={[
                  {
                    color: isPeriodDay ? COLORS.periodDay : COLORS.primary,
                    fontSize: 10.5,
                  },
                ]}>
                {alreadySelected.mood.title}
              </Text>
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: rw(40),
    borderRadius: 20,
    elevation: 5,
    marginVertical: rh(2),
    marginHorizontal: rw(3),
    paddingBottom: rh(1.5),
  },
  icon: {
    width: 120,
    height: 120,
    marginTop: rh(1),
  },
  text: {
    flexShrink: 1,
    fontFamily: 'IRANYekanMobileBold',
  },
  titleContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: rw(2),
    justifyContent: 'center',
    flexShrink: 1,
    borderRightWidth: 2,
    borderRightColor: COLORS.expSympReadMore,
    paddingRight: rw(3),
    marginTop: rh(2),
  },
  selectedBadge: {
    ...StyleSheet.absoluteFillObject,
    top: rh(-1.5),
    left: rw(-3),
  },
  degreeContainer: {
    flexDirection: 'row',
    width: '90%',
    flexShrink: 1,
  },
  deleteActivity: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExpSympCard;
