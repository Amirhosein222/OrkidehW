import { StyleSheet } from 'react-native';
import { rh, rw } from '../../../../configs';
import { adjust } from '../../../../libs/helpers';

export const colors = {
  gradient1: '#DD607E',
  gradient2: '#985C9A',
  catItemBg: '#C3BED4',
  catItemColor: '#7A5A93',
};

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: rh(12),
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    right: rw(7),
    zIndex: 1,
  },
  cardContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    width: rw(45),
  },
  card: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: rh(8),
    alignSelf: 'flex-end',
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  body: {
    fontSize: adjust(11),
    lineHeight: 20 * 1.5,
    textAlign: 'center',
    fontFamily: 'IRANYekanMobileBold',
    color: colors.catItemColor,
    marginRight: 5,
  },
  subCategoriesList: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 15,
  },
  subCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '85%',
    backgroundColor: colors.catItemBg,
    margin: 5,
    borderRadius: 20,
    paddingRight: 10,
  },
  iconContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    borderRadius: 30,
    width: 30,
    height: 30,
  },
});

export default styles;
