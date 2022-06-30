const validatePhoneNumber = function (phoneNumber) {
  let regex = new RegExp('^(\\+98|0)?9\\d{9}$');
  let result = regex.test(phoneNumber);

  return result;
};

export default validatePhoneNumber;
