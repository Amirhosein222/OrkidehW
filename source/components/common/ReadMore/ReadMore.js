import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS, rh, rw } from '../../../configs';

const ReadMore = ({ children, textStyle }) => {
  const [numberOfLines, SetNumberOfLines] = useState(null);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length > 1); //to check the text is more than 4 lines or not
    // SetNumberOfLines(e.nativeEvent.lines.length);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : 4}
        style={{ ...styles.text, ...textStyle }}>
        {children}
      </Text>

      {lengthMore ? (
        <Text onPress={toggleNumberOfLines} style={styles.showMoreLess}>
          {textShown ? 'بستن' : 'بیشتر بخوانید...'}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: rh(2),
  },
  text: {
    marginTop: rh(1),
    lineHeight: 21,
    fontSize: 12,
    fontFamily: 'IRANYekanMobileBold',
    paddingRight: rw(4),
    paddingLeft: rw(4),
    textAlign: 'right',
    color: COLORS.textCommentCal,
  },
  showMoreLess: {
    lineHeight: 21,
    marginTop: rh(1),
    fontSize: 11,
    fontFamily: 'IRANYekanMobileBold',
    color: COLORS.textLight,
    alignSelf: 'flex-end',
    marginRight: rw(4),
  },
});

export default ReadMore;
