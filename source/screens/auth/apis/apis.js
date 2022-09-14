import authApi from '../../../libs/api/authApi';
import getLoginClient from '../../../libs/api/loginClientApi';

export const registerApi = async function (phoneNumber, regentCode) {
  try {
    const formData = new FormData();
    formData.append('mobile', phoneNumber);
    formData.append('gender', 'woman');
    formData.append('regent_code', regentCode);
    const res = await authApi.post('register/send_activation_code', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const changeNumberApi = async function (phoneNumber) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('mobile', phoneNumber);
    formData.append('gender', 'woman');
    const res = await loginClient.post('change/mobile', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const checkCodeApi = async function (mobile, code) {
  try {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('activation_code', code);
    formData.append('gender', 'woman');
    const res = await authApi.post('check_activation_code', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const sendCodeApi = async function (mobile) {
  try {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('gender', 'woman');
    const res = await authApi.post('send_activation_code', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
