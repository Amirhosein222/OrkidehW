import getLoginClient from '../../../libs/api/loginClientApi';

export const getMyGapsApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get('index/my-memory?gender=woman');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getAllGapsApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      'index/accepted-memory?filter_user=1&gender=woman',
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const likeGapApi = async function (id) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('memory_id', id);
    const res = await loginClient.post('like/memory', formData);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const reportGapApi = async function (id, text) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('memory_id', id);
    formData.append('text', text);
    const res = await loginClient.post('report/memory', formData);

    return res.data;
  } catch (error) {
    throw error;
  }
};
