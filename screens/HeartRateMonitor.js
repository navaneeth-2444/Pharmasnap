import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeartRateMonitor = () => {
  const [heartRate, setHeartRate] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('http://10.113.19.31:3000/events');
    eventSource.onopen = () => {
      setConnected(true);
      console.log('Connected to heart rate server');
    };
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setHeartRate(data.bpm);
        setLastUpdate(new Date(data.timestamp));
      } catch (error) {
        console.error('Error parsing heart rate data:', error);
      }
    };
    eventSource.onerror = () => {
      setConnected(false);
      console.log('Connection to heart rate server lost');
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const getHeartRateColor = (bpm) => {
    if (!bpm) return '#999';
    if (bpm < 60) return '#4CAF50';
    if (bpm < 100) return '#2196F3';
    if (bpm < 120) return '#FF9800';
    return '#F44336';
  };

  const getHeartRateStatus = (bpm) => {
    if (!bpm) return 'No Data';
    if (bpm < 60) return 'Resting';
    if (bpm < 100) return 'Normal';
    if (bpm < 120) return 'Elevated';
    return 'High';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galaxy Watch Heart Rate</Text>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: connected ? '#4CAF50' : '#F44336' }]} />
        <Text style={styles.statusText}>{connected ? 'Connected' : 'Disconnected'}</Text>
      </View>
      <View style={styles.heartRateContainer}>
        <Text style={[styles.heartRateValue, { color: getHeartRateColor(heartRate) }]}>
          {heartRate ? `${heartRate}` : '--'}
        </Text>
        <Text style={styles.bpmText}>BPM</Text>
      </View>
      <Text style={styles.statusLabel}>{getHeartRateStatus(heartRate)}</Text>
      {lastUpdate && (
        <Text style={styles.timestamp}>
          Last Updated: {lastUpdate.toLocaleTimeString()}
        </Text>
      )}
      <Text style={styles.instructions}>
        Make sure your Galaxy Watch app is running and both devices are on the same WiFi network.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  heartRateContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heartRateValue: {
    fontSize: 72,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  bpmText: {
    fontSize: 24,
    color: '#666',
    marginTop: -10,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  instructions: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HeartRateMonitor;