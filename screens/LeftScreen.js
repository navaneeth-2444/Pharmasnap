import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function LeftScreen() {
  const [showForm, setShowForm] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [timing, setTiming] = useState('morning');
  const [foodRelation, setFoodRelation] = useState('before');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmPm] = useState('AM');

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
  };

  const ReminderForm = () => (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Medicine Name</Text>
        <TextInput
          style={styles.input}
          value={medicineName}
          onChangeText={setMedicineName}
          placeholder="Enter medicine name"
          placeholderTextColor="#999"
          autoCorrect={false}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time</Text>
        <View style={styles.timeContainer}>
          <View style={[styles.pickerContainer, styles.timePickerContainer]}>
            <Picker
              selectedValue={hour}
              onValueChange={setHour}
              style={styles.timePicker}
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                <Picker.Item key={h} label={h} value={h} />
              ))}
            </Picker>
          </View>
          <Text style={styles.timeColon}>:</Text>
          <View style={[styles.pickerContainer, styles.timePickerContainer]}>
            <Picker
              selectedValue={minute}
              onValueChange={setMinute}
              style={styles.timePicker}
            >
              {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
          </View>
          <View style={[styles.pickerContainer, styles.timePickerContainer]}>
            <Picker
              selectedValue={ampm}
              onValueChange={setAmPm}
              style={styles.timePicker}
            >
              <Picker.Item label="AM" value="AM" />
              <Picker.Item label="PM" value="PM" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Timing</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={timing}
            onValueChange={setTiming}
            style={styles.picker}
          >
            <Picker.Item label="Morning" value="morning" />
            <Picker.Item label="Noon" value="noon" />
            <Picker.Item label="Night" value="night" />
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
          >
            <Picker.Item label="Before Food" value="before" />
            <Picker.Item label="After Food" value="after" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>
    </View>
  );

  const ReminderList = () => (
    <View style={styles.reminderListContainer}>
      <ScrollView style={styles.reminderList}>
        {reminders.map(reminder => (
          <View key={reminder.id} style={styles.reminderItem}>
            <Text style={styles.reminderText}>{reminder.medicineName}</Text>
            <Text style={styles.reminderText}>{reminder.time}</Text>
            <Text style={styles.reminderText}>{reminder.timing}</Text>
            <Text style={styles.reminderText}>{reminder.foodRelation} food</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicine Reminder</Text>
      {showForm ? <ReminderForm /> : <ReminderList />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  timePicker: {
    height: 50,
  },
  timeColon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderListContainer: {
    flex: 1,
  },
  reminderList: {
    flex: 1,
  },
  reminderItem: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reminderText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
