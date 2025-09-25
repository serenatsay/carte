import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

import { ParsedMenu, CartSelectionItem, HungerLevel, WildcardSelection } from '../types';
import { wildcardService } from '../services/wildcardService';

interface WildcardModalProps {
  visible: boolean;
  onClose: () => void;
  onWildcardOrder: (selections: WildcardSelection[], clearExisting: boolean) => void;
  menu: ParsedMenu;
  preferredLanguage: string;
  currentCart: Record<string, CartSelectionItem>;
}

export default function WildcardModal({
  visible,
  onClose,
  onWildcardOrder,
  menu,
  preferredLanguage,
  currentCart,
}: WildcardModalProps) {
  const [partySize, setPartySize] = useState(1);
  const [hungerLevel, setHungerLevel] = useState<HungerLevel>('moderate');
  const [adventurous, setAdventurous] = useState(false);
  const [loading, setLoading] = useState(false);

  const partySizes = [1, 2, 3, 4, 5, 6, 7, 8];
  const hungerLevels: { value: HungerLevel; label: string; description: string }[] = [
    { value: 'light', label: 'Light bite', description: 'Just a small snack' },
    { value: 'moderate', label: 'Moderate', description: 'Regular meal' },
    { value: 'hungry', label: 'Hungry', description: 'Larger portions' },
    { value: 'feast', label: 'Feast', description: 'Multiple courses' },
  ];

  const handleGetRecommendations = async (clearExisting: boolean) => {
    setLoading(true);
    try {
      const request = {
        menu,
        partySize,
        hungerLevel,
        adventurous,
        preferredLanguage,
        currentCart,
      };

      const response = await wildcardService.getWildcardOrder(request);

      if (response.ok) {
        onWildcardOrder(response.selections, clearExisting);
        onClose();
      }
    } catch (error) {
      console.error('Wildcard order error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to get recommendations. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const currentCartCount = Object.values(currentCart).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Pick for Me</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            Let AI choose the perfect meal for you based on your preferences
          </Text>

          {/* Party Size */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Party Size</Text>
            <View style={styles.buttonRow}>
              {partySizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionButton,
                    partySize === size && styles.selectedOption,
                  ]}
                  onPress={() => setPartySize(size)}
                >
                  <Text style={[
                    styles.optionText,
                    partySize === size && styles.selectedOptionText,
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Hunger Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How hungry are you?</Text>
            {hungerLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.hungerOption,
                  hungerLevel === level.value && styles.selectedHungerOption,
                ]}
                onPress={() => setHungerLevel(level.value)}
              >
                <View style={styles.hungerContent}>
                  <Text style={[
                    styles.hungerLabel,
                    hungerLevel === level.value && styles.selectedOptionText,
                  ]}>
                    {level.label}
                  </Text>
                  <Text style={[
                    styles.hungerDescription,
                    hungerLevel === level.value && styles.selectedHungerDescription,
                  ]}>
                    {level.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Adventurous Toggle */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={() => setAdventurous(!adventurous)}
            >
              <View style={styles.toggleContent}>
                <Text style={styles.toggleLabel}>Feeling adventurous?</Text>
                <Text style={styles.toggleDescription}>
                  Include unique local dishes and specialties
                </Text>
              </View>
              <View style={[
                styles.toggle,
                adventurous && styles.toggleActive,
              ]}>
                <View style={[
                  styles.toggleIndicator,
                  adventurous && styles.toggleIndicatorActive,
                ]} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {currentCartCount > 0 && (
            <TouchableOpacity
              style={[styles.actionButton, styles.addToCartButton]}
              onPress={() => handleGetRecommendations(false)}
              disabled={loading}
            >
              <Text style={[styles.actionButtonText, styles.addToCartButtonText]}>
                {loading ? 'Getting Recommendations...' : 'Add to Current Order'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.newOrderButton]}
            onPress={() => handleGetRecommendations(true)}
            disabled={loading}
          >
            <Text style={[styles.actionButtonText, styles.newOrderButtonText]}>
              {loading ? 'Getting Recommendations...' : 'Start New Order'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#16a34a',
    backgroundColor: '#f0f9ff',
  },
  optionText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  hungerOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedHungerOption: {
    borderColor: '#16a34a',
    backgroundColor: '#f0f9ff',
  },
  hungerContent: {
    flex: 1,
  },
  hungerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  hungerDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedHungerDescription: {
    color: '#16a34a',
  },
  toggleContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleContent: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#16a34a',
  },
  toggleIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleIndicatorActive: {
    alignSelf: 'flex-end',
  },
  actions: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  newOrderButton: {
    backgroundColor: '#16a34a',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addToCartButtonText: {
    color: '#16a34a',
  },
  newOrderButtonText: {
    color: 'white',
  },
});