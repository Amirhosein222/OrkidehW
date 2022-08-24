import Snackbar from 'react-native-snackbar';

export const PALETTE = {
  white: '#FDFCFC',
  white1: '#FBFAFA',
  snow: '#F6F0F0',
  gainsboro: '#E0D8D9',
  blackShadows: '#C8BABC',
  blackShadowsDark: '#B7AFB9',
  middlePurple: '#E37FB4',
  silverMetallic: '#B6B0B9',
  oldLavender: '#786972',
  darkPurple: '#331B2D',
  nickle: '#687777',
  roseRed: '#C03762',
  greenPantone: '#4AB755',
  vividSkyBlue: '#48c7ef',
};

const COLORS = {
  mainBg: PALETTE.white,
  primary: PALETTE.middlePurple,
  inputTabBarBg: PALETTE.snow,
  Bg: PALETTE.snow,
  textCommentCal: PALETTE.oldLavender,
  textLight: PALETTE.blackShadowsDark,
  textDark: PALETTE.nickle,
  error: PALETTE.roseRed,
  success: PALETTE.greenPantone,
  borderLinkBtn: PALETTE.vividSkyBlue,
  icon: PALETTE.blackShadowsDark,
  white: PALETTE.white,
  cardBg: PALETTE.white1,
  darkYellow: '#FFCC00',
  red: '#FE024E',
  red1: '#FFC2D4',
  rossoCorsa: '#D30706',
  lightRed: '#fca09f',
  darkRed: '#D40707',
  orange: '#F9741B',
  lightPink: 'rgba(254, 2, 148, 0.2)',
  lightWhite: 'rgba(220,220,220, 0.9)',
  grey: '#ACAFBC',
  lightGrey: 'rgba(240, 240, 240, 1)',
  dark: '#707070',
  yellow: '#ebda21',
  green: '#00c951',
  welcomeBg: '#12263A',
  expSympTitle: '#8F7879',
  expSympReadMore: '#B7AFB9',
  tabBarBg: '#F4EDED',
  plusIconBg: '#E27FB4',
};

const SCROLL_VIEW_CONTAINER = {
  justifyContent: 'center',
  alignItems: 'center',
};

const SNACKBAR_OPTIONS = {
  duration: Snackbar.LENGTH_LONG,
  rtl: true,
  fontFamily: 'Qs_Iranyekan_bold',
  backgroundColor: COLORS.red,
};

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
  textDayFontFamily: 'Qs_Iranyekan_bold',
  textMonthFontFamily: 'Qs_Iranyekan_bold',
  textDayHeaderFontFamily: 'Qs_Iranyekan_bold',
  textMonthFontWeight: 'bold',
  textDayFontSize: 14,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 10,
};

export { SCROLL_VIEW_CONTAINER, COLORS, SNACKBAR_OPTIONS, CALENDAR_THEME };
