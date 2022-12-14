import getLoginClient from '../../../libs/api/loginClientApi';

export const getPostsApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get('index/post?category_id=&gender=woman');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getCategoriesApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get('index/category?type=post&gender=woman');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getSinglePostApi = async function (id) {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(`show/post/detail?id=${id}&gender=woman`);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
