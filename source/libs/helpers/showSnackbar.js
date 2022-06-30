import Snackbar from 'react-native-snackbar';
import { SNACKBAR_OPTIONS } from '../../configs';

const showSnackbar = (text, status) => {
  Snackbar.show({
    ...SNACKBAR_OPTIONS,
    text: text,
    backgroundColor: status === 'success' ? '#22D354' : '#FE024E',
  });
};

export default showSnackbar;
