import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App';
import { MenuItem, MenuSection } from '../types';
import MenuItemCard from '../components/MenuItemCard';
import { useCartStore } from '../store/cartStore';
import CustomDropdown from '../components/CustomDropdown';
import WildcardModal from '../components/WildcardModal';
import { LANGUAGE_OPTIONS } from '../constants/languages';
import { parseMenuService } from '../services/parseMenuService';
import { WildcardSelection } from '../types';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

export default function MenuScreen() {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const route = useRoute<MenuScreenRouteProp>();
  const { menu } = route.params;

  const [currentMenu, setCurrentMenu] = useState(menu);
  const [uiLanguage, setUiLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [loadingLanguage, setLoadingLanguage] = useState('');
  const [showWildcardModal, setShowWildcardModal] = useState(false);

  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  const handleBackToCamera = () => {
    navigation.navigate('Camera');
  };

  const handleViewOrder = () => {
    navigation.navigate('OrderSummary');
  };

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === uiLanguage || loading) return;

    setLoading(true);
    setLoadingLanguage(newLanguage);
    setUiLanguage(newLanguage);

    try {
      const updatedMenu = await parseMenuService.translateMenu(currentMenu, newLanguage);
      setCurrentMenu(updatedMenu);
    } catch (error) {
      console.error('Translation error:', error);
      setUiLanguage(currentMenu.targetLanguage || 'English');
    } finally {
      setLoading(false);
      setLoadingLanguage('');
    }
  };

  const handleRetryTranslation = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const menuImage = currentMenu.originalImageData || '';
      const retryMenu = await parseMenuService.parseMenu(menuImage, uiLanguage);
      setCurrentMenu(retryMenu);
    } catch (error) {
      console.error('Retry translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWildcardOrder = (selections: WildcardSelection[], clearExisting: boolean) => {
    if (clearExisting) {
      clearCart();
    }

    selections.forEach(selection => {
      addToCart(selection.item, selection.sectionId, selection.quantity);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToCamera} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Carte</Text>
        <TouchableOpacity
          onPress={handleRetryTranslation}
          disabled={loading}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>
            {loading ? 'Retrying...' : 'Retry'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.languageInfo}>
          <Text style={styles.languageText}>
            {currentMenu.originalLanguage ?
              `Translated from ${currentMenu.originalLanguage} to` :
              'Translated to'
            }
          </Text>
          <CustomDropdown
            value={uiLanguage}
            onChange={handleLanguageChange}
            options={LANGUAGE_OPTIONS}
            disabled={loading}
          />
        </View>

        {currentMenu.sections.map((section) => (
          <MenuSectionComponent key={section.id} section={section} />
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.stickyBar}>
        <View style={styles.stickyButtonRow}>
          <TouchableOpacity
            style={[styles.stickyButton, styles.wildcardButton]}
            onPress={() => setShowWildcardModal(true)}
          >
            <Text style={styles.wildcardButtonText}>
              🎯 Pick for Me
            </Text>
          </TouchableOpacity>

          {cartItemCount > 0 && (
            <TouchableOpacity
              style={[styles.stickyButton, styles.orderButton]}
              onPress={handleViewOrder}
            >
              <Text style={styles.orderButtonText}>
                View Order ({cartItemCount})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <WildcardModal
        visible={showWildcardModal}
        onClose={() => setShowWildcardModal(false)}
        onWildcardOrder={handleWildcardOrder}
        menu={currentMenu}
        preferredLanguage={uiLanguage}
        currentCart={cart}
      />

      {/* Full-screen Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {loadingLanguage ? `Translating to ${loadingLanguage}...` : 'Analyzing menu...'}
            </Text>
            <Text style={styles.loadingSubtext}>This will take a moment</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function MenuSectionComponent({ section }: { section: MenuSection }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {section.translatedTitle || section.originalTitle || 'Menu Items'}
      </Text>
      {section.items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          sectionId={section.id}
        />
      ))}
    </View>
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
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  placeholder: {
    width: 80, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  languageInfo: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  bottomPadding: {
    height: 100, // Space for sticky bar
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  orderButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  stickyButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stickyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  wildcardButton: {
    backgroundColor: '#f59e0b',
  },
  wildcardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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