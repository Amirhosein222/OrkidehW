import getDates from './getDates';
import validatePhoneNumber from './validatePhoneNumber';
import { getFromAsyncStorage } from './getFromStorages';
import convertToJalaali from './convertToJalaali';
import showSnackbar from './showSnackbar';
import lastIndexOf from './lastIndexOf';
import getAccessToken from './getAccessToken';
import numberConverter from './numberConverter';
import convertToFullDate from './converToFullDate';
import { initPusher } from './notification';
import adjust from './adjust';

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export {
  getFromAsyncStorage,
  getDates,
  validatePhoneNumber,
  convertToJalaali,
  showSnackbar,
  lastIndexOf,
  getAccessToken,
  numberConverter,
  initPusher,
  convertToFullDate,
  validateEmail,
  adjust,
};
