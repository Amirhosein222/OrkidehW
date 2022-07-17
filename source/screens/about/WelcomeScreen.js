import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';

import { Text } from '../../components/common';
import { rh, rw } from '../../configs';
import { COLORS } from '../../configs/styles';

const WelcomeScreen = ({ navigation, route }) => {
  const params = route.params || {};

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View
        style={{
          marginTop: 'auto',
          marginBottom: rh(3),
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row', marginTop: 'auto' }}>
          <Text color="white" large marginRight={rh(0.8)} bold>
            عزیزم
          </Text>
          <Text color="white" large bold>
            {params.name}
          </Text>
        </View>
        <Text color="white" large bold>
          خیلی خوشحالیم که به جمع ما پیوستی!
        </Text>
      </View>
      <View
        style={{ width: rw(100), paddingHorizontal: rw(3), marginTop: rh(3) }}>
        <Text large color="white" textAlign="right" marginRight={rw(3)}>
          ما تمام تلاشمون رو کردیم که تا حد امکان کار با این نرم افزار رو برات
          ساده و جذاب کنیم.
        </Text>
        <Text
          color="white"
          large
          //   textAlign="right"
          marginRight={rw(0)}
          marginTop={rh(0)}>
          قول میدم که ارکیده تورو شگفت زده میکنه.
        </Text>
        <Text
          large
          color="white"
          textAlign="right"
          marginRight={rw(4)}
          marginTop={rh(2)}>
          هر جایی که نفهمیدی باید چیکارکنی یا اینکه گیج شدی،از توی صفحه ی
          منو،وارد قسمت راهنمایی شو.اونجا توضیح کار با تمام بخش های نرم افزار
          اومده. اگر باز هم دچار مشکل بودی، حتما به پشتیبانی پیام بده.
        </Text>
        <Text
          color="white"
          large
          textAlign="right"
          marginRight={rw(4)}
          marginTop={rh(2)}>
          ما خوشحال میشیم که پیامهای گرمت رو در هر ساعت از شبانه روز بگیریم و
          بهشون پاسخ بدیم.
        </Text>
        <Text
          large
          color="white"
          marginTop={rh(5)}
          textAlign="right"
          bold
          marginRight={rw(4)}>
          یادت نره،ما یک خانواده ایم!
        </Text>
      </View>

      <Pressable
        style={styles.btn}
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeDrawer' }],
            }),
          )
        }>
        <Text color="white" large>
          ادامه
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.welcomeBg,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  btn: {
    width: rw(85),
    backgroundColor: COLORS.pink,
    height: rh(6),
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 'auto',
    marginBottom: rh(6),
    elevation: 3,
  },
});

export default WelcomeScreen;
