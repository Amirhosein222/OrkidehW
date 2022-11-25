import getLoginClient from '../../../../libs/api/loginClientApi';
import moment from 'jalali-moment';

export const setPasswordApi = async function (fullInfo, password) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('display_name', fullInfo.display_name);
    formData.append('name', fullInfo.name);
    formData.append('password', password);
    formData.append('repeat_password', password);
    formData.append(
      'birth_date',
      moment(fullInfo.birth_date, 'X').locale('en').format('jYYYY/jMM/jDD'),
    );
    formData.append('gender', 'woman');
    formData.append('is_password_active', 1);
    formData.append('is_finger_active', Number(fullInfo.is_finger_active));

    const res = await loginClient.post('complete/profile', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
