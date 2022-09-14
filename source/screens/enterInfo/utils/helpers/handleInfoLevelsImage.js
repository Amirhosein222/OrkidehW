import pinfoBg from '../../../../assets/vectors/register/pinfo.png';
import pdates_bg from '../../../../assets/vectors/register/pdate.png';
import pdis_bg from '../../../../assets/vectors/register/pdist.png';

export const handleInfoLevelsImage = (registerStage, settings) => {
  switch (registerStage) {
    case 0:
      return settings?.app_image_field_username
        ? { uri: settings.app_image_field_username.value }
        : pinfoBg;
    case 1:
      console.log(
        'settings?.app_image_last_period_date ',
        settings?.app_image_last_period_date,
      );
      return settings?.app_image_last_period_date
        ? { uri: settings.app_image_last_period_date.value }
        : pdates_bg;
    case 2:
      return settings?.app_image_last_period_length
        ? { uri: settings.app_image_last_period_length.value }
        : pdis_bg;
    case 3:
      return settings?.app_image_length_between_periods
        ? { uri: settings.app_image_length_between_periods.value }
        : pdis_bg;
    default:
      break;
  }
};
