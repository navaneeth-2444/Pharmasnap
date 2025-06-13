import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import axios from 'axios';

export default function CameraScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required.');
      }
    })();
  }, []);

  const handleImage = async (sourceFn) => {
    const result = await sourceFn({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      const base64 = asset.base64;

      const reply = await sendImageToGemini(base64);
      if (reply) {
        setResponseText(reply);
        setTimeout(() => {
          Speech.speak(reply, {
            language: 'en',
            rate: 1.0,
          });
        }, 500); // short delay to sync with UI
      }
    }
  };

  const sendImageToGemini = async (base64Image) => {
    const apiKey = 'AIzaSyDWy_VWqeRh8qqk53qsrcfaxdxSCq78-HY'; // 👈 Replace with your key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = "What is the name of the medicine shown in this photo? Reply only with the name. Give me what this medicine can do in a few points";

    try {
      const response = await axios.post(url, {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      });

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    } catch (error) {
      console.error('Gemini API error:', error.message);
      return 'Unable to identify the medicine.';
    }
  };

  return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>PharmaSnap</Text>

        <TouchableOpacity style={styles.button} onPress={() => handleImage(ImagePicker.launchCameraAsync)}>
            <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleImage(ImagePicker.launchImageLibraryAsync)}>
            <Text style={styles.buttonText}>Select from Gallery</Text>
        </TouchableOpacity>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        {responseText !== '' && <Text style={styles.response}>{responseText}</Text>}
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010D00',
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    marginBottom: 80,
    color: '#ffffff',
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 20,
    borderRadius: 10,
  },
  response: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#8C8C8C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
