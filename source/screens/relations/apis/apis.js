import getLoginClient from '../../../libs/api/loginClientApi';

export const getRelsApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      'index/relation?include_man=1&include_woman=1&gender=woman',
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const addRelApi = async function (mobile, pic, name) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('mobile', mobile);
    pic &&
      formData.append('man_image', {
        uri: pic,
        name: 'spouseImg.png',
        type: 'image/png',
      });
    formData.append('man_name', name);
    formData.append('gender', 'woman');
    const res = await loginClient.post('store/relation', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const updateRelApi = async function (id, name, mobile, pic) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', id);
    formData.append('gender', 'woman');
    formData.append('man_name', name);
    formData.append('mobile', mobile);
    pic &&
      formData.append('man_image', {
        uri: pic,
        name: 'spouseImg.png',
        type: 'image/png',
      });
    const res = await loginClient.post('update/relation', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
