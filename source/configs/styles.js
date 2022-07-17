import Snackbar from 'react-native-snackbar';

const COLORS = {
  pink: '#fe0294',
  red: '#FE024E',
  red1: '#FFC2D4',
  rossoCorsa: '#D30706',
  lightRed: '#fca09f',
  darkRed: '#D40707',
  orange: '#F9741B',
  darkYellow: '#FFCC00',
  lightPink: 'rgba(254, 2, 148, 0.2)',
  white: '#fff',
  lightWhite: 'rgba(220,220,220, 0.9)',
  grey: '#ACAFBC',
  lightGrey: 'rgba(240, 240, 240, 1)',
  dark: '#707070',
  yellow: '#ebda21',
  green: '#00c951',
  welcomeBg: '#12263A',
};

const SCROLL_VIEW_CONTAINER = {
  justifyContent: 'center',
  alignItems: 'center',
};

const SNACKBAR_OPTIONS = {
  duration: Snackbar.LENGTH_LONG,
  rtl: true,
  fontFamily: 'Vazir',
  backgroundColor: COLORS.red,
};

const CALENDAR_THEME = {
  calendarBackground: '#ffffff',
  textSectionTitleColor: COLORS.pink,
  selectedDayBackgroundColor: '#00adf5',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#00adf5',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00adf5',
  selectedDotColor: '#ffffff',
  arrowColor: COLORS.pink,
  monthTextColor: COLORS.pink,
  textDayFontFamily: 'Vazir',
  textMonthFontFamily: 'Vazir',
  textDayHeaderFontFamily: 'Vazir',
  textMonthFontWeight: 'bold',
  textDayFontSize: 14,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 10,
};

export { SCROLL_VIEW_CONTAINER, COLORS, SNACKBAR_OPTIONS, CALENDAR_THEME };
