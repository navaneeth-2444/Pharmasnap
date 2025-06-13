import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Animated } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function RightScreen() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [heartRate, setHeartRate] = useState(null);
  const intervalRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bleManager = useRef(new BleManager()).current;

  useEffect(() => {
    // Check initial Bluetooth state
    checkBluetoothState();

    // Listen for Bluetooth state changes
    const subscription = bleManager.onStateChange((state) => {
      setBluetoothEnabled(state === 'PoweredOn');
      if (state === 'PoweredOff' && connected) {
        setConnected(false);
        Alert.alert('Bluetooth Disconnected', 'Bluetooth was turned off. Heart rate monitoring stopped.');
      }
    }, true);

    return () => {
      subscription.remove();
    };
  }, []);

  const checkBluetoothState = async () => {
    try {
      const state = await bleManager.state();
      setBluetoothEnabled(state === 'PoweredOn');
    } catch (error) {
      console.error('Error checking Bluetooth state:', error);
    }
  };

  const handleConnect = async () => {
    if (!bluetoothEnabled) {
      Alert.alert(
        'Warning',
        'Please turn on Bluetooth',
        [{ text: 'OK' }]
      );
      return;
    }
    simulateBluetooth();
  };

  const simulateBluetooth = () => {
    setConnecting(true);
    setTimeout(() => {
      setBluetoothEnabled(true);
      Alert.alert('Bluetooth Enable', 'Bluetooth has been enabled.');
      setTimeout(() => {
        setConnecting(false);
        setConnected(true);
        Alert.alert('Conected', 'Connected to Samsung Galaxy Watch 3!');
      }, 1500);
    }, 1500);
  };

  useEffect(() => {
    if (connected) {
      // Start simulating heart rate values
      setHeartRate(randomHeartRate());
      intervalRef.current = setInterval(() => {
        setHeartRate(randomHeartRate());
      }, 2000);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      setHeartRate(null);
      clearInterval(intervalRef.current);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
    return () => clearInterval(intervalRef.current);
  }, [connected]);

  const randomHeartRate = () => {
    // Simulate heart rate values between 69 and 74 bpm
    return Math.floor(Math.random() * 6) + 69;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Rate Monitor</Text>
      {!connected ? (
        <TouchableOpacity
          style={styles.button}
          onPress={handleConnect}
          disabled={connecting}
        >
          <Text style={styles.buttonText}>
            {connecting ? 'Connecting...' : 'Connect'}
          </Text>
          {connecting && <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />}
        </TouchableOpacity>
      ) : (
        <Animated.View style={[styles.heartRateContainer, { opacity: fadeAnim }]}> 
          <View style={styles.heartRateRow}>
            <Text style={styles.heartRateValue}>{heartRate}</Text>
            <Text style={styles.heartRateUnit}>bpm</Text>
          </View>
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
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    letterSpacing: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  statusLabel: {
    color: '#bbb',
    fontSize: 16,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    minWidth: 220,
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heartRateContainer: {
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#2a2a2a',
    padding: 30,
    borderRadius: 100,
    width: 170,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  heartRateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  heartRateValue: {
    color: '#D32F2F',
    fontSize: 48,
    fontWeight: 'bold',
    marginRight: 5,
  },
  heartRateUnit: {
    color: '#D32F2F',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heartRateStatus: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
