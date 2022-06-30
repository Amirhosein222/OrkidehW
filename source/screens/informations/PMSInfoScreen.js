// /* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
  Container,
  Divider,
  Text,
  Image,
  RowContainer,
} from '../../components/common';
import { Bars } from '../../components/charts';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS } from '../../configs';

const PMSInfoScreen = ({}) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <Container justifyContent="flex-start">
      <StatusBar translucent backgroundColor="transparent" />
      <RowContainer marginTop="20px">
        <Text marginRight={4}>میانگین داده شما در طول 6 دوره آخر</Text>
        <Icon
          name="long-arrow-alt-left"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          size={25}
        />
        <Text small bold marginLeft={4}>
          پی ام اس شما
        </Text>
      </RowContainer>
      <RowContainer justifyContent="center">
        <View style={styles.pmsInfoCont}>
          <Image
            imageSource={require('../../assets/images/pa.png')}
            width="75px"
            height="75px"
          />
          <Text>1 بار</Text>
        </View>
        <View style={styles.pmsInfoCont}>
          <Image
            imageSource={require('../../assets/images/de.png')}
            width="75px"
            height="75px"
          />
          <Text>2 بار</Text>
        </View>
        <View style={styles.pmsInfoCont}>
          <Image
            imageSource={require('../../assets/images/se.png')}
            width="75px"
            height="75px"
          />
          <Text>1 بار</Text>
        </View>
        <View style={styles.pmsInfoCont}>
          <Image
            imageSource={require('../../assets/images/se.png')}
            width="75px"
            height="75px"
          />
          <Text>6 بار</Text>
        </View>
      </RowContainer>
      <Divider color={COLORS.pink} width="90%" />
      <Text
        alignSelf="flex-end"
        marginRight="20"
        marginTop="20"
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
        مقایسه علائم PMS شما و همسالان شما
      </Text>

      <RowContainer justifyContent="space-evenly">
        <Image
          imageSource={require('../../assets/images/se.png')}
          width="75px"
          height="75px"
        />
        <Bars />
      </RowContainer>
      <RowContainer justifyContent="space-evenly">
        <Image
          imageSource={require('../../assets/images/pa.png')}
          width="75px"
          height="75px"
        />

        <Bars />
      </RowContainer>
      <RowContainer justifyContent="space-evenly">
        <Image
          imageSource={require('../../assets/images/de.png')}
          width="75px"
          height="75px"
        />

        <Bars />
      </RowContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  imgContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pmsInfoCont: {
    margin: 5,
  },
});

export default PMSInfoScreen;
