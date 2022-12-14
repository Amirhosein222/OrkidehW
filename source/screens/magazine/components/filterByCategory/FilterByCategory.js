import React, { useRef, useState } from 'react';
import { Text, Pressable, View } from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import { colors, styles } from './styles';
import { COLORS } from '../../../../configs';

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const FilterByCategory = ({ cats, handleSelectedCat }) => {
  const [show, setShow] = useState(false);
  const ref = useRef();

  const onCatPress = cId => {
    ref.current.animateNextTransition();
    setShow(false);
    setTimeout(() => {
      handleSelectedCat(cId);
    }, 200);
  };

  const RenderCats = () => {
    return cats.map(cat => {
      return (
        <Pressable
          onPress={() => onCatPress(cat.id)}
          style={styles.subCategoryItem}>
          <Text key={cat.id.toString()} style={[styles.body]}>
            {cat.title}
          </Text>
          <Feather name="search" color={'#7A5A93'} size={16} />
        </Pressable>
      );
    });
  };

  return (
    <Transitioning.View
      ref={ref}
      transition={transition}
      style={styles.container}>
      <View style={styles.cardContainer}>
        <Pressable
          onPress={() => {
            ref.current.animateNextTransition(), setShow(!show);
          }}
          style={[styles.card]}>
          <LinearGradient
            colors={[colors.gradient1, colors.gradient2]}
            style={styles.iconContainer}>
            <Ionicons name="ios-filter" color={COLORS.white} size={20} />
          </LinearGradient>
        </Pressable>
        {show && (
          <LinearGradient
            colors={[colors.gradient1, colors.gradient2]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.subCategoriesList}>
            {RenderCats()}
          </LinearGradient>
        )}
      </View>
    </Transitioning.View>
  );
};

export default FilterByCategory;
