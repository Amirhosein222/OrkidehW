import getWomanClient from '../../../../libs/api/womanApi';

export const editPeriodInfoApi = async function (
  lastPeriodDate,
  cycleLength,
  periodLength,
) {
  try {
    const womanClient = await getWomanClient();
    const formData = new FormData();
    formData.append('last_period_date', lastPeriodDate);
    formData.append('period_length', periodLength);
    formData.append('cycle_length', cycleLength);

    const res = await womanClient.post('store/period_info', formData);

    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
