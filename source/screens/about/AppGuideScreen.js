/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { StatusBar, StyleSheet, View, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Text, Divider, TabBar, Header } from '../../components/common';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../configs';

const AppGuideScreen = ({ navigation }) => {
  const { settings } = useContext(WomanInfoContext);
  const isPeriodDay = useIsPeriodDay();

  return (
    <View
      style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: rh(1) }}>
        <View style={styles.container}>
          <FontAwesome5
            name="map-signs"
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            size={90}
          />
          <Text
            medium
            bold
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
            راهنما
          </Text>
          <Divider
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            width="85%"
            style={{ marginTop: 20 }}
          />
          <View style={{ paddingHorizontal: rw(2), marginTop: rh(1) }}>
            <Text
              marginRight={rw(3)}
              medium
              color={COLORS.dark}
              textAlign="right">
              {settings.app_text_help_page.value}
            </Text>
          </View>
        </View>
      </ScrollView>
      <TabBar seperate={true} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: rh(3),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppGuideScreen;
