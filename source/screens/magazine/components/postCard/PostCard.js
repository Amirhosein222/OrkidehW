import React from 'react';
import { Text, Image, StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { baseUrl, COLORS, rh, rw } from '../../../../configs';
import { adjust } from '../../../../libs/helpers';

const PostCard = ({ post }) => {
  const navigation = useNavigation();
  console.log('post ', post);
  return (
    <Pressable
      onPress={() => navigation.navigate('FullPost', { post })}
      style={styles.container}>
      <Image
        source={
          post?.images.length
            ? { uri: baseUrl + post.images[0].image }
            : require('../../../../assets/images/2.jpg')
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={{ ...styles.text, color: COLORS.primary }}>
          {post.title}
        </Text>
        <Text
          numberOfLines={4}
          ellipsizeMode="tail"
          style={{
            ...styles.text,
            color: COLORS.textDark,
            fontSize: adjust(10),
          }}>
          {post.text.replace(/(<([^>]+)>)/gi, '')}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: rw(85),
    alignSelf: 'center',
    marginVertical: rh(2),
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 13,
  },

  text: {
    fontFamily: 'IRANYekanMobileBold',
    fontSize: adjust(11),
    textAlign: 'right',
  },
  textContainer: {
    width: '65%',
  },
});

export default PostCard;
