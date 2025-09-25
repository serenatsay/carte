import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../../App';
import { parseMenuService } from '../services/parseMenuService';

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

export default function CameraScreen() {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [preferredLanguage] = useState('English');

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].base64;
      if (imageUri) {
        await processImage(`data:image/jpeg;base64,${imageUri}`);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].base64;
      if (imageUri) {
        await processImage(`data:image/jpeg;base64,${imageUri}`);
      }
    }
  };

  const processImage = async (imageBase64: string) => {
    setLoading(true);
    try {
      const menu = await parseMenuService.parseMenu(imageBase64, preferredLanguage);
      navigation.navigate('Menu', { menu });
    } catch (error) {
      console.error('Menu parsing error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carte</Text>
        <Text style={styles.translateLabel}>Translate to {preferredLanguage}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.message}>Scan Menu to Translate</Text>
        <Text style={styles.subMessage}>Take a photo or select from gallery</Text>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={takePicture}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            📷 Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.galleryButton}
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            🖼️ Choose from Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Analyzing menu...</Text>
            <Text style={styles.loadingSubtext}>This may take a moment</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  translateLabel: {
    fontSize: 16,
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 48,
    textAlign: 'center',
  },
  cameraButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});