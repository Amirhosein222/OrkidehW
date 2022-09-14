/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import { CalendarList } from 'react-native-calendars-persian';
import { useNavigation, CommonActions } from '@react-navigation/native';
import moment from 'moment-jalaali';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CalendarInfo } from '../../components/informations';
import { Button, Snackbar } from '../common';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import getWomanClient from '../../libs/api/womanApi';
import {
  convertToJalaali,
  getFromAsyncStorage,
  lastIndexOf,
  numberConverter,
} from '../../libs/helpers';

import { COLORS, ICON_SIZE, rh, rw } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

import EditIcon from '../../assets/icons/btns/enabled-edit.svg';

const CALENDAR_THEME = {
  calendarBackground: '#ffffff',
  textSectionTitleColor: COLORS.primary,
  selectedDayBackgroundColor: '#00adf5',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#00adf5',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00adf5',
  selectedDotColor: '#ffffff',
  arrowColor: COLORS.primary,
  monthTextColor: COLORS.primary,
  textDayFontFamily: 'IRANYekanXFaNum-Regular',
  textMonthFontFamily: 'IRANYekanXFaNum-Regular',
  textDayHeaderFontFamily: 'IRANYekanXFaNum-Regular',
  textDayFontSize: 14,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 10,
};

const CalendarModal = ({ visible, closeModal, updateCal }) => {
  const isPeriodDay = useIsPeriodDay();
  const navigation = useNavigation();
  const { userCalendar, handleUserCalendar } = useContext(WomanInfoContext);
  const [currentMarkedDates, setCurrentMarkedDates] = useState([]);
  const [newMarkedDates, setNewMarkedDates] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [edit, setEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newDatesForApi, setNewDatesForApi] = useState([]);
  const [info, setInfo] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getCalendar = async function () {
    const womanClient = await getWomanClient();
    womanClient.get('show/calendar').then((response) => {
      updateCal = false;
      if (response.data.is_successful) {
        handleUserCalendar(response.data.data);
        handleCurrentMarkedDates([...response.data.data]);
      } else {
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      }
    });
  };

  const sortDates = function (dates) {
    dates.sort(
      (a, b) =>
        moment(a.date, 'jYYYY/jMM/jDD').diff(
          moment().startOf('day'),
          'seconds',
        ) -
        moment(b.date, 'jYYYY/jMM/jDD').diff(
          moment().startOf('day'),
          'seconds',
        ),
    );
    return dates;
  };

  const updateCalendar = async function (newDates) {
    const sortedDates = sortDates(newDates);
    setIsUpdating(true);
    const womanClient = await getWomanClient();
    womanClient
      .post('update/calendar', sortedDates)
      .then((response) => {
        setIsUpdating(false);
        setCurrentMarkedDates([]);
        setNewMarkedDates([]);
        setNewDatesForApi([]);
        setEdit(false);
        setSelectedOption(null);
        getCalendar();
        if (response.data.is_successful) {
          if (response.data.data[1].getPeriodInfo === true) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'EnterInfo',
                    params: {
                      reEnter: true,
                      name: info.display_name,
                      firstDay: response.data.data.first_date,
                    },
                  },
                ],
              }),
            );
          } else {
            setSnackbar({
              msg: 'تغییرات با موفقیت اعمال شد.',
              visible: true,
              type: 'success',
            });
          }
        } else {
          setSnackbar({
            msg: numberConverter(response.data.message),
            visible: true,
            delay: 7000,
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  //get days between two dates
  function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);

    while (currentDate <= stopDate) {
      const jalaaliDate = convertToJalaali(
        moment(currentDate).locale('en').format('YYYY-MM-DD'),
      );
      dateArray.push({ date: jalaaliDate, type: 'period' });
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  //Calculate the dates differ
  const checkPeriodDaysDiff = function () {
    //get last period date added by user
    const lastAddedPeriodIndex = lastIndexOf(newDatesForApi, 'period');
    if (lastAddedPeriodIndex === -1) {
      return false;
    }
    const lastAddedPeriod = newDatesForApi[lastAddedPeriodIndex].date;
    const newDate = moment(lastAddedPeriod, 'jYYYY/jMM/jDD')
      .locale('en')
      .format('YYYY-MM-DD');

    //get last date from user calendar
    const currentDates = Object.entries(currentMarkedDates);
    const periodDates = [];
    currentDates.map((date) => {
      if (date[1].type === 'period') {
        periodDates.push(date[0]);
      }
    });

    const lastDate = periodDates[periodDates.length - 1];

    const a = moment(lastDate);
    const b = moment(newDate);
    const diff = b.diff(a, 'days');
    return { diff: diff, lastDate: lastDate, newDate: newDate };
  };

  const checkDatesLength = async function () {
    const diffInfo = checkPeriodDaysDiff();
    if (diffInfo === false) {
      updateCalendar(newDatesForApi);
      return;
    }
    if (diffInfo.diff === 0 || diffInfo.diff === 1) {
      updateCalendar(newDatesForApi);
      return;
    } else if (diffInfo.diff > 1 && diffInfo.diff <= 5) {
      const newDates = getDates(diffInfo.lastDate, diffInfo.newDate);
      updateCalendar(newDates);
      return;
    } else if (diffInfo.diff >= 5 && diffInfo.diff <= 12) {
      Alert.alert(
        'پیام',
        'آیا میخواهید روز های بین بازه زمانی انتخاب شده هم به عنوان روز پریود ثبت شوند؟',
        [
          {
            text: 'نه',
            onPress: () => {
              updateCalendar(newDatesForApi);
            },
            style: 'cancel',
          },
          {
            text: 'اره',
            onPress: () => {
              const newDates = getDates(diffInfo.lastDate, diffInfo.newDate);
              updateCalendar(newDates);
            },
          },
        ],
        { cancelable: false },
      );
    } else if (diffInfo.diff < 0) {
      updateCalendar(newDatesForApi);
    } else {
      updateCalendar(newDatesForApi);
      return;
    }
  };

  // convert current dates from calendar api, then render on Calendar
  const handleCurrentMarkedDates = function (calendar) {
    const currentDates = {};
    calendar.map((item) => {
      const convertedDate = moment(item.date, 'X')
        .locale('en')
        .format('YYYY-MM-DD');
      currentDates[convertedDate] = {
        selected: true,
        marked: true,
        selectedColor:
          item.type === 'period'
            ? COLORS.primary
            : item.type === 'sex'
            ? COLORS.error
            : item.type === 'period_f'
            ? COLORS.orange
            : item.type === 'ovulation_f'
            ? COLORS.darkYellow
            : COLORS.darkRed,
        type: item.type,
      };
    });
    setCurrentMarkedDates(currentDates);
  };

  const handleNewMarkedDates = async function (date) {
    const selectedDate = date.dateString;
    if (moment(selectedDate).isBefore(today) === false) {
      setSnackbar({
        msg: 'شما میتوانید تاریخ را فقط تا امروز را انتخاب کنید.',
        visible: true,
      });
      return;
    }

    const today = moment().format('YYYY-MM-DD');
    const jalaaliDate = convertToJalaali(selectedDate);
    const newDates = { ...newMarkedDates };

    if (newMarkedDates[selectedDate]) {
      if (newMarkedDates[selectedDate].hasOwnProperty('dontDelete')) {
        // dont add this date with type delete to api dates object only remove it on the calendar
        delete newDates[selectedDate];
        setNewMarkedDates(newDates);
        return;
      }
      let removed = [...newDatesForApi];
      removed.push({
        date: jalaaliDate,
        type: selectedOption === 'sex' ? 'sexDelete' : 'delete',
      });
      removed = removed.filter((d) => d.type !== 'period' && d.type !== 'sex');
      delete newDates[selectedDate];
      setNewMarkedDates(newDates);
      setNewDatesForApi(removed);
    } else {
      newDates[selectedDate] = {
        selected: true,
        marked: true,
        selectedColor:
          selectedOption === 'period' ? COLORS.primary : COLORS.error,
      };
      const selectedDates = [...newDatesForApi];
      selectedDates.push({ date: jalaaliDate, type: selectedOption });
      setNewDatesForApi(selectedDates);
      setNewMarkedDates(newDates);
    }
  };

  const handleSelectedOption = function (selectedOpt) {
    setSelectedOption(selectedOpt);
    const currentDateskeys = Object.entries(currentMarkedDates);
    if (selectedOpt === 'period') {
      let markedDates = currentDateskeys;
      currentDateskeys.map((date) => {
        switch (date[1].type) {
          case 'period':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.primary,
            };
            break;
          case 'sex':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.error,
              disableTouchEvent: true,
              disabled: true,
            };
            break;
          case 'period_f':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.orange,
              dontDelete: true,
              // disableTouchEvent: true,
              // disabled: true,
            };
            break;
          case 'ovulation_f':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.darkYellow,
              dontDelete: true,
              // disableTouchEvent: true,
              // disabled: true,
            };
            break;
          default:
            break;
        }
      });
      setNewMarkedDates(markedDates);
    } else {
      let markedDates = currentDateskeys;
      currentDateskeys.map((date) => {
        switch (date[1].type) {
          case 'period':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.primary,
              disableTouchEvent: true,
              disabled: true,
            };
            break;
          case 'sex':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.error,
            };
            break;
          case 'period_f':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.orange,
              dontDelete: true,
              // disableTouchEvent: true,
              // disabled: true,
            };
            break;
          case 'ovulation_f':
            markedDates[date[0]] = {
              selected: true,
              marked: true,
              selectedColor: COLORS.darkYellow,
              dontDelete: true,
              // disableTouchEvent: true,
              // disabled: true,
            };
            break;
          default:
            break;
        }
      });
      setNewMarkedDates(markedDates);
    }
  };

  const showGuide = function () {
    setSnackbar({
      msg: 'لطفا ابتدا گزینه مورد نظر جهت ویرایش تاریخ را انتخاب کنید',
      visible: true,
    });
  };

  const showEdit = function (cancel = false) {
    if (cancel === true) {
      setEdit(!edit);
      return;
    }
    showGuide();
    setEdit(!edit);
  };

  const submitNewDates = async function () {
    if (!selectedOption) {
      showGuide();
      return;
    }
    if (newDatesForApi.length === 0) {
      setSnackbar({
        msg: 'لطفا تاریخ مورد نظر را انتخاب کتید',
        visible: true,
      });
      return;
    }
    if (selectedOption === 'sex') {
      updateCalendar(newDatesForApi);
    } else {
      checkDatesLength();
    }
  };

  useEffect(() => {
    userCalendar && handleCurrentMarkedDates([...userCalendar]);
    getFromAsyncStorage('fullInfo').then((res) => {
      if (res) {
        setInfo(JSON.parse(res));
      }
    });
  }, []);

  useEffect(() => {
    if (updateCal === true) {
      getCalendar();
    }
  }, [updateCal]);

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
          <Pressable
            onPress={isUpdating ? null : closeModal}
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
        {edit === true ? (
          <CalendarList
            jalali
            markedDates={newMarkedDates}
            hideExtraDays={true}
            disableMonthChange={true}
            firstDay={6}
            hideDayNames={false}
            showWeekNumbers={false}
            style={styles.calendar}
            theme={CALENDAR_THEME}
            markingType="simple"
            horizontal={true}
            pagingEnabled={false}
            onDayPress={
              selectedOption
                ? (day, localDay) => {
                    handleNewMarkedDates(day);
                  }
                : () => showGuide()
            }
          />
        ) : currentMarkedDates.length !== 0 ? (
          <CalendarList
            jalali
            markedDates={currentMarkedDates}
            hideExtraDays={true}
            markingType="simple"
            disableMonthChange={false}
            firstDay={7}
            hideDayNames={false}
            showWeekNumbers={false}
            style={styles.calendar}
            theme={CALENDAR_THEME}
            horizontal={true}
            pagingEnabled={false}
            onDayPress={() => {}}
          />
        ) : (
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          />
        )}

        <CalendarInfo
          showBtns={edit}
          selectedOption={selectedOption}
          handleSelectedOption={handleSelectedOption}
        />

        {edit === true ? (
          <View style={styles.editContainer}>
            <Button
              color={isPeriodDay ? COLORS.fireEngineRed : COLORS.borderLinkBtn}
              title="ثبت تغییرات"
              mode="contained"
              style={{ width: '35%', marginRight: 10, height: 40 }}
              loading={edit && isUpdating ? true : false}
              disabled={edit && isUpdating ? true : false}
              onPress={() => submitNewDates()}
              Icon={null}
            />
            <Button
              color={isPeriodDay ? COLORS.fireEngineRed : COLORS.borderLinkBtn}
              title="لغو"
              style={{ width: '35%', height: 40 }}
              onPress={() => showEdit(true)}
              Icon={null}
            />
          </View>
        ) : (
          <Button
            title="ویرایش دوره ها"
            Icon={() => <EditIcon style={ICON_SIZE} />}
            color={COLORS.borderLinkBtn}
            style={{ ...styles.btn, marginTop: rh(5), marginBottom: rh(4) }}
            onPress={() => showEdit()}
          />
        )}
      </View>
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          delay={snackbar?.delay}
          handleVisible={handleVisible}
        />
      ) : null}
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
    height: rh(80),
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
    justifyContent: 'flex-end',
    marginTop: rh(2),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },

  calendar: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
  },
  btn: {
    width: '80%',
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  editContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: rh(4),
  },
});
export default CalendarModal;
