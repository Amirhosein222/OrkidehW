import axios from 'axios';
import FormData from 'form-data';
import moment from 'jalali-moment';

import { getAccessToken } from '../helpers';
import getLoginClient from '../api/loginClientApi';
import getWomanClient from '../api/womanApi';

export const verifyRelation = async function (code) {
  try {
    const token = await getAccessToken();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('code', code);
    const res = await axios.post(
      'https://orkidehapp.ir/api/user/verify/relation',
      formData,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const buyGoldenAccount = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      'payment/buy/account_type_golden?gender=woman',
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const getSettings = async function (key) {
  try {
    const res = await axios.get('https://orkidehapp.ir/api/setting');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const getWomanInfo = async function () {
  try {
    const womanClient = await getWomanClient();
    const res = await womanClient.get('login_woman');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const getPusherUserId = async function () {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'woman');
    const res = await loginClient.post('pusher/beams-auth', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const sendActivationCode = async function (mobile) {
  try {
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('mobile', mobile);
    const res = await axios.post(
      'https://orkidehapp.ir/api/auth/user/send_activation_code',
      formData,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCmApi = async function (id) {
  try {
    const token = await getAccessToken();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('memory_id', id);
    const res = await axios.post(
      'https://orkidehapp.ir/api/user/delete/memory',
      formData,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCycles = async function (id) {
  try {
    const token = await getAccessToken();
    const res = await axios.get('https://orkidehapp.ir/api/woman/show/cycles', {
      headers: {
        Authorization: `${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addCommentApi = async function (parentId, postId, type, cm) {
  try {
    const token = await getAccessToken();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('post_id', postId);
    formData.append('post_type', type);
    formData.append('comment_text', cm);
    formData.append('parent_id', parentId);
    const res = await axios.post(
      'https://orkidehapp.ir/api/user/comment/store',
      formData,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const setMaritalStatusApi = async function (fullInfo, status) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('display_name', 'lll');
    formData.append('password', fullInfo.password);
    formData.append('repeat_password', fullInfo.password);
    formData.append('is_married', status);
    formData.append('pregnancy_history', '0');
    formData.append(
      'birth_date',
      moment(fullInfo.birth_date).locale('en').format('jYYYY/jM/jD'),
    );
    formData.append('gender', 'woman');
    formData.append('is_password_active', Number(fullInfo.is_password_active));
    formData.append('is_finger_active', Number(fullInfo.is_finger_active));
    const res = await loginClient.post('complete/profile', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
