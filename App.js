import React from 'react';
import PagerView from 'react-native-pager-view';
import { StyleSheet, View } from 'react-native';

import LeftScreen from './screens/LeftScreen';
import CameraScreen from './screens/CameraScreen';
import RightScreen from './screens/RightScreen';
import HeartRateMonitor from './screens/HeartRateMonitor';

export default function App() {
  return (
    <PagerView style={styles.pagerView} initialPage={1}>
      <View key="0" style={styles.page}>
        <LeftScreen />
      </View>
      <View key="1" style={styles.page}>
        <CameraScreen />
      </View>
      <View key="2" style={styles.page}>
        <RightScreen />
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});
