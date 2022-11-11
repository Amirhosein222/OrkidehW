/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Checkbox } from 'react-native-paper';

import { Button, Text } from '../index';
import { rw, rh, COLORS, ICON_SIZE } from '../../../configs';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { FlatList } from 'react-native-gesture-handler';
import { reportGapApi } from '../../../screens/gaps/apis';
import { useApi, useIsPeriodDay } from '../../../libs/hooks';

import EnSend from '../../../assets/icons/btns/enabled-send.svg';
import DsSend from '../../../assets/icons/btns/disabled-send.svg';

const ReportModal = ({ title, id, visible, closeModal, setSnackbar }) => {
  const isPeriodDay = useIsPeriodDay();
  const { settings, allSettings } = useContext(WomanInfoContext);
  const [reportOption, setReportOption] = useState('');
  const [description, setDescription] = useState('');
  const [report, setReport] = useApi(() => reportGapApi(id, reportOption));
  const [reports, setReports] = useState([]);

  const onReport = () => {
    setReport();
  };

  useEffect(() => {
    if (report.data && report.data.is_successful) {
      setSnackbar({
        msg: 'ok',
        visible: true,
        type: 'success',
      });
    }
    report.data &&
      !report.data.is_successful &&
      setSnackbar({
        msg: report.data.message,
        visible: true,
      });
  }, [report]);

  const RenderReportOptions = ({ item }) => {
    return (
      <View style={styles.checkBoxContainer}>
        <Text
          bold
          size={10.5}
          color={
            item === reportOption && isPeriodDay
              ? COLORS.fireEngineRed
              : item === reportOption && !isPeriodDay
              ? COLORS.primary
              : COLORS.textLight
          }>
          {item}
        </Text>
        <Checkbox
          uncheckedColor={COLORS.textLight}
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          status={item === reportOption ? 'checked' : 'unchecked'}
          onPress={() => {
            setReportOption(item);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    const result = [];
    allSettings.forEach((s, index) => {
      if (s.key === 'app_memory_report[]') {
        result.push(s.value);
      }
    });
    setReports(result);
  }, []);
  useEffect(() => {
    if (report.data && report.data.is_successful) {
      closeModal();
      setSnackbar({
        msg: 'گزارش شما با موفقیت ثبت شد',
        visible: true,
        type: 'success',
      });
    }
    if (report.data && !report.data.is_successful) {
      closeModal();
      setSnackbar({
        msg: JSON.stringify(report.data.message),
        visible: true,
      });
    }
  }, [report]);

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
      onBackdropPress={report.isFetching ? null : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ marginLeft: 'auto' }} />
          <View style={{ marginLeft: 'auto', marginRight: rw(2) }}>
            <Text bold size={12} color={COLORS.textCommentCal}>
              گزارش {title}
            </Text>
          </View>

          <Pressable
            onPress={report.isFetching ? null : closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>

        <View style={{ width: rw(75) }}>
          <Text
            bold
            color={COLORS.textLight}
            marginTop={rh(2)}
            textAlign="right">
            لطفا دلیل خود را برای گزارش و بازبینی این خاطره توسط کارشناسان ما را
            انتخاب کنید
          </Text>
        </View>

        {reports.length ? (
          <View style={styles.optionsContainer}>
            <FlatList
              data={reports}
              keyExtractor={(item, index) => index.toString()}
              renderItem={RenderReportOptions}
              contentContainerStyle={{
                alignItems: 'flex-end',
              }}
            />
          </View>
        ) : null}

        <View style={styles.textInputContainer}>
          <Text
            color={COLORS.textLight}
            bold
            size={10.5}
            alignSelf="flex-end"
            marginRight={rw(8)}
            marginBottom={rh(1)}>
            توضیحات :
          </Text>
          <TextInput
            onChangeText={setDescription}
            placeholder="توضیحات خود را اینجا وارد کنید"
            placeholderTextColor={COLORS.textLight}
            style={styles.inputArea}
            returnKeyType="next"
            multiline
          />
        </View>
        <Button
          disabled={report.isFetching || !reportOption}
          loading={report.isFetching}
          title={`گزارش ${title}`}
          Icon={[
            () => <DsSend style={ICON_SIZE} />,
            () => <EnSend style={ICON_SIZE} />,
          ]}
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          onPress={onReport}
          style={{ marginTop: 'auto', marginBottom: rh(3), width: rw(68) }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(82),
    elevation: 5,
    borderRadius: 25,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(2),
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: rh(2),
    marginVertical: rh(2),
  },
  inputArea: {
    backgroundColor: COLORS.inputTabBarBg,
    height: rh(20),
    width: rw(68),
    borderRadius: 10,
    color: COLORS.textLight,
    fontFamily: 'IRANYekanMobileBold',
    textAlign: 'right',
    textAlignVertical: 'top',
    fontSize: 13,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    width: '87%',
  },
  optionsContainer: {
    width: '100%',
    marginTop: rh(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportModal;
