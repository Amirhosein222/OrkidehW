import getLoginClient from '../../../../libs/api/loginClientApi';

export const setReminderApi = async function (reminder) {
  console.log('reminder ', reminder);
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('type', reminder.type);
    formData.append('send_notif', reminder.status ? 1 : 0);
    formData.append('send_sms', 0);

    const res = await loginClient.post('alarm/setting/update', formData);

    return res.data;
  } catch (error) {
    console.log('e ', error.response);
    throw error;
  }
};

export const getRemindersApi = async function (reminder) {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get('alarm/setting/show?gender=woman');
    return res.data;
  } catch (error) {
    console.log('e ', error.response);
    throw error;
  }
};
