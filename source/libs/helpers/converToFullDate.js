import JDate from 'jalali-date';
import moment from 'moment-jalaali';

export default function convertToFullDate(d) {
  const date = moment(d, 'X').locale('en').format('jYYYY/jM/jD');
  const formatted = moment(date, 'jYYYY/jM/jD');
  const jdate = new JDate(
    formatted.jYear(),
    formatted.jMonth() + 1,
    formatted.jDate(),
  ); // => default to today
  return jdate.format('DD MMMM YYYY');
}
