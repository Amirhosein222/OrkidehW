import { StyleSheet } from 'react-native';
import { COLORS, rh, rw } from '../../../../configs';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: rw(81),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.mainBg,
    overflow: 'hidden',
  },
  topHeader: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    paddingVertical: rh(2),
  },
  safe: {
    flex: 1,
  },
  root: {
    flex: 1,
    paddingRight: rw(0),
    borderRightWidth: 1.8,
    borderRightColor: COLORS.textLight,
    width: '95%',
    alignItems: 'flex-end',
    marginRight: rw(5),
  },
  textStyle: {
    fontSize: 13,
  },
  moreLess: {
    color: COLORS.textLight,
    fontFamily: 'IRANYekanMobileBold',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  separator: {
    width: rw(70),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textLight,
    marginVertical: rh(2),
  },
  avatarBorderdContainer: {
    backgroundColor: COLORS.inputTabBarBg,
    width: rw(10.4),
    height: rh(4.7),
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
});
