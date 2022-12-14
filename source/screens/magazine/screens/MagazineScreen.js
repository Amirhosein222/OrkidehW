/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';

import PostCard from '../components/postCard';
import FilterByCategory from '../components/filterByCategory';
import {
  Snackbar,
  BackgroundView,
  ScreenHeader,
} from '../../../components/common';

import { getPostsApi, getCategoriesApi } from '../apis';
import { useApi, useIsPeriodDay } from '../../../libs/hooks';
import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../../configs';

const MagazineScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [posts, setPosts] = useApi(() => getPostsApi());
  const [categories, setCategories] = useApi(() => getCategoriesApi());

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const handleLayoutAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      // create: { type: 'easeIn', property: 'scaleY' },
      update: { type: 'spring', springDamping: 0.5 },
      // delete: { type: 'easeOut', property: 'scaleY' },
    });
  };

  const filterByCategory = selectedCatId => {
    const filtereds = posts.data.data.filter(
      p => p.categories[0].id === selectedCatId,
    );
    setFilteredPosts(filtereds);
    // handleLayoutAnimation();
  };

  const RenderPosts = useCallback(({ item }) => {
    return <PostCard post={item} />;
  }, []);

  useEffect(() => {
    setPosts();
    setCategories();
  }, []);

  if (posts.isFetching) {
    return (
      <BackgroundView>
        <ScreenHeader title="مجله" />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      </BackgroundView>
    );
  } else {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ScreenHeader title="مجله" />
        <FilterByCategory
          cats={(categories.data && categories.data.data) || []}
          handleSelectedCat={filterByCategory}
        />
        {posts.data && posts.data.data.length ? (
          <FlatList
            data={filteredPosts.length ? filteredPosts : posts.data.data}
            keyExtractor={item => item.id}
            renderItem={RenderPosts}
            style={{ width: '100%', marginTop: rh(6) }}
          />
        ) : null}

        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </BackgroundView>
    );
  }
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    marginTop: STATUS_BAR_HEIGHT + rh(1.4),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  image: { width: rw(90), height: rh(14), borderRadius: 5, marginTop: rh(4) },
  imgContainer: {
    width: '100%',
    alignItems: 'center',
  },
  overlayText: {
    ...StyleSheet.absoluteFillObject,
    left: rw(62),
    top: rh(13.5),
  },
});

export default MagazineScreen;
