import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [status, setStatus] = useState('Ready');

  const handleCameraPress = () => {
    setStatus('Camera pressed');
    Alert.alert('Camera', 'Camera functionality will be implemented here');
  };

  const handleGalleryPress = () => {
    setStatus('Gallery pressed');
    Alert.alert('Gallery', 'Gallery functionality will be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.title}>Carte Mobile</Text>
        <Text style={styles.subtitle}>Menu Translation App</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.status}>Status: {status}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCameraPress}
          >
            <Text style={styles.primaryButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGalleryPress}
          >
            <Text style={styles.secondaryButtonText}>🖼️ Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 48,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e5f3ff',
    borderRadius: 8,
  },
  status: {
    fontSize: 14,
    color: '#1e40af',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  secondaryButtonText: {
    color: '#16a34a',
    fontSize: 18,
    fontWeight: '600',
  },
});
