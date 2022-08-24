/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  FlatList,
} from 'react-native';

import {
  Text,
  RowContainerو
  Image,
} from '../../components/common';


const ChartFive = ({ navigation }) => {
  const [reports, setReports] = useState(null);
    return (
      <View>
           <RowContainer marginTop="20px">
                <Text>میانگین داده شما در طول 6 دوره آخر</Text>
                <Icon name="long-arrow-alt-left" color={COLORS.primary} size={25} />
                <Text bold>شما PMS</Text>
            </RowContainer> 
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChartScreen;
