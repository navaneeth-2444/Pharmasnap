import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Animated } from 'react-native';

export default function RightScreen() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [heartRate, setHeartRate] = useState(null);
  const intervalRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const simulateBluetooth = () => {
    setConnecting(true);
    setTimeout(() => {
      setBluetoothEnabled(true);
      Alert.alert('Bluetooth Enabled', 'Bluetooth has been enabled.');
      setTimeout(() => {
        setConnecting(false);
        setConnected(true);
        Alert.alert('Connected', 'Connected to Samsung Galaxy Watch 3!');
      }, 1500);
    }, 1500);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galaxy Watch 3 Heart Rate Monitor</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>
          Bluetooth: {bluetoothEnabled ? 'Enabled' : 'Disabled'}
        </Text>
        <Text style={styles.statusLabel}>
          Watch: {connected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>
      {!connected ? (
        <TouchableOpacity
          style={styles.button}
          onPress={simulateBluetooth}
          disabled={connecting}
        >
          <Text style={styles.buttonText}>
            {connecting ? 'Connecting...' : 'Connect to Galaxy Watch 3'}
          </Text>
          {connecting && <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />}
        </TouchableOpacity>
      ) : (
        <Animated.View style={[styles.heartRateContainer, { opacity: fadeAnim }]}> 
          <Text style={styles.heartRateValue}>{heartRate} bpm</Text>
          <Text style={styles.heartRateStatus}>{getHeartRateStatus(heartRate)}</Text>
        </Animated.View>
      )}
    </View>
  );
}

function getHeartRateStatus(bpm) {
  if (!bpm) return '';
  if (bpm < 60) return 'Resting';
  if (bpm < 100) return 'Normal';
  if (bpm < 120) return 'Elevated';
  return 'High';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  statusLabel: {
    color: '#bbb',
    fontSize: 16,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    minWidth: 220,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartRateContainer: {
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#333',
    padding: 30,
    borderRadius: 16,
    width: 220,
  },
  heartRateValue: {
    color: '#4CAF50',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heartRateStatus: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
