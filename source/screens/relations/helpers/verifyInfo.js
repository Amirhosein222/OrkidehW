import { validatePhoneNumber } from '../../../libs/helpers';

function verifyInfo(partner, partnerMobile, setSnackbar) {
  if (!partner || !partnerMobile) {
    setSnackbar({
      msg: 'فیلد های نام و شماره موبایل الزامی می باشند!',
      visible: true,
    });
    return false;
  }
  if (!validatePhoneNumber(partnerMobile)) {
    setSnackbar({
      msg: 'فرمت شماره موبایل همراه معتبر نیست.',
      visible: true,
    });
    return false;
  }
  return true;
}

export default verifyInfo;
