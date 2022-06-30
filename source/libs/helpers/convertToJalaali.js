import moment from 'moment-jalaali';

const convertToJalaali = function (date) {
  const convertedDate = moment(date).locale('en').format('jYYYY/jMM/jDD');
  return convertedDate;
};

export default convertToJalaali;
