import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

interface MenuScreenProps {
  route: MenuScreenRouteProp;
}

export default function MenuScreen({ route }: MenuScreenProps) {
  const { menu } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Translation</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>Menu parsed successfully!</Text>
        <Text style={styles.details}>Sections found: {menu.sections?.length || 0}</Text>
      </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 20,
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  details: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});