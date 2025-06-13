import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Animated, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function LeftScreen() {
  const [showForm, setShowForm] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [medicineName, setMedicineName] = useState('');
  const [timing, setTiming] = useState('morning');
  const [foodRelation, setFoodRelation] = useState('before');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmPm] = useState('AM');

  const formAnimation = useRef(new Animated.Value(0)).current;
  const plusButtonAnimation = useRef(new Animated.Value(1)).current;

  const handleLongPress = (reminder) => {
    setSelectedReminder(reminder.id);
    Alert.alert(
      'Delete Reminder',
      'Do you want to delete this reminder?',
      [
        {
          text: 'Cancel',
          onPress: () => setSelectedReminder(null),
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            const newReminders = reminders.filter(r => r.id !== reminder.id);
            setReminders(newReminders);
            setSelectedReminder(null);
            
            // Reset animations when the last reminder is deleted
            if (newReminders.length === 0) {
              setShowForm(false);
              plusButtonAnimation.setValue(0);
              Animated.timing(plusButtonAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handlePlusPress = () => {
    setShowForm(true);
    Animated.parallel([
      Animated.timing(plusButtonAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    const newReminder = {
      id: Date.now(),
      medicineName,
      timing,
      foodRelation,
      time: `${hour}:${minute} ${ampm}`
    };
    setReminders([...reminders, newReminder]);
    setShowForm(false);
    // Reset form
    setMedicineName('');
    setTiming('morning');
    setFoodRelation('before');
    setHour('12');
    setMinute('00');
    setAmPm('AM');
    // Reset animations
    Animated.parallel([
      Animated.timing(plusButtonAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const ReminderForm = () => (
    <Animated.View 
      style={[
        styles.formContainer,
      ]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={medicineName}
          onChangeText={setMedicineName}
          placeholder="Enter medicine name"
          placeholderTextColor="#666"
          autoCorrect={false}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputContainer}> 
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Timing</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={timing}
            onValueChange={setTiming}
            style={styles.picker}
            dropdownIconColor="#fff"
            mode="dropdown"
          >
            <Picker.Item label="Morning" value="morning" style={{ color: '#000', fontSize: 16 }} />
            <Picker.Item label="Noon" value="noon" style={{ color: '#000', fontSize: 16 }} />
            <Picker.Item label="Night" value="night" style={{ color: '#000', fontSize: 16 }} />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Food Relation</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={foodRelation}
            onValueChange={setFoodRelation}
            style={styles.picker}
            dropdownIconColor="#fff"
            mode="dropdown"
          >
            <Picker.Item label="Before Food" value="before" style={{ color: '#000', fontSize: 16 }} />
            <Picker.Item label="After Food" value="after" style={{ color: '#000', fontSize: 16 }} />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const ReminderList = () => (
    <View style={styles.reminderListContainer}>
      <ScrollView style={styles.reminderList}>
        {reminders.map(reminder => (
          <TouchableOpacity
            key={reminder.id}
            onLongPress={() => handleLongPress(reminder)}
            delayLongPress={500}
            activeOpacity={0.7}
          >
            <View 
              style={[
                styles.reminderItem,
                selectedReminder === reminder.id && styles.reminderItemSelected
              ]}
            >
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderName}>{reminder.medicineName}</Text>
                <Text style={styles.reminderTime}>{reminder.time}</Text>
              </View>
              <View style={styles.reminderDetails}>
                <Text style={styles.reminderDetail}>
                  <Text style={styles.reminderLabel}>Timing: </Text>
                  {reminder.timing}
                </Text>
                <Text style={styles.reminderDetail}>
                  <Text style={styles.reminderLabel}>Food: </Text>
                  {reminder.foodRelation}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handlePlusPress}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {showForm ? (
        <ReminderForm />
      ) : (
        reminders.length > 0 ? (
          <ReminderList />
        ) : (
          <View style={styles.initialView}>
            <Text style={styles.remindersText}>Reminders</Text>
            <Animated.View
              style={[
                styles.plusButtonContainer,
                {
                  opacity: plusButtonAnimation,
                  transform: [{
                    scale: plusButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  }],
                },
              ]}
            >
              <TouchableOpacity 
                style={styles.initialPlusButton} 
                onPress={handlePlusPress}
              >
                <Text style={styles.initialPlusButtonText}>+</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remindersText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 1,
  },
  forYouText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 20,
    letterSpacing: 1,
  },
  plusButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    zIndex: 1,
  },
  initialPlusButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  initialPlusButtonText: {
    color: '#fff',
    fontSize: 80,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    lineHeight: 80,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
    width: '100%',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  pickerContainer: {
    backgroundColor: '#000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerContainer: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#000',
  },
  timePicker: {
    height: 50,
    color: '#fff',
  },
  timeColon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
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
  reminderListContainer: {
    flex: 1,
    padding: 20,
  },
  reminderList: {
    flex: 1,
  },
  reminderItem: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  reminderItemSelected: {
    backgroundColor: '#3a3a3a',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderTime: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  reminderDetails: {
    marginTop: 8,
  },
  reminderDetail: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 4,
  },
  reminderLabel: {
    color: '#888',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#D32F2F',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
    left: '60%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
