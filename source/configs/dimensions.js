import { Dimensions } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
  } from 'react-native-responsive-dimensions';

export const STATUS_BAR_HEIGHT = getStatusBarHeight();
export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;
export { rh, rw };
