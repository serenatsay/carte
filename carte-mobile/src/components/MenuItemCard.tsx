import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { MenuItem } from '../types';
import { useCartStore } from '../store/cartStore';

interface MenuItemCardProps {
  item: MenuItem;
  sectionId: string;
}

export default function MenuItemCard({ item, sectionId }: MenuItemCardProps) {
  const cart = useCartStore((state) => state.cart);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

  const cartItem = cart[item.id];
  const quantity = cartItem?.quantity || 0;

  const handleIncrement = () => {
    increment(sectionId, item.id);
  };

  const handleDecrement = () => {
    decrement(item.id);
  };

  const formatPrice = () => {
    if (!item.price) return null;
    return `${item.price.currency === 'USD' ? '$' : item.price.currency}${item.price.amount}`;
  };

  const getSpiceLevelEmoji = () => {
    if (!item.spiceLevel || item.spiceLevel === 0) return '';
    return '🌶️'.repeat(Math.min(item.spiceLevel, 3));
  };

  const getBadgeEmojis = () => {
    if (!item.badges || item.badges.length === 0) return '';
    return item.badges.map(badge => {
      switch (badge) {
        case 'Local Specialty': return '🏠';
        case 'Must Try': return '⭐';
        default: return '';
      }
    }).join(' ');
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.translatedName}</Text>
          {item.translatedDescription && (
            <Text style={styles.description}>{item.translatedDescription}</Text>
          )}
          {item.culturalNotes && (
            <Text style={styles.culturalNotes}>💡 {item.culturalNotes}</Text>
          )}

          <View style={styles.metadata}>
            {getSpiceLevelEmoji() && (
              <Text style={styles.spice}>{getSpiceLevelEmoji()}</Text>
            )}
            {getBadgeEmojis() && (
              <Text style={styles.badges}>{getBadgeEmojis()}</Text>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          {item.price && (
            <Text style={styles.price}>{formatPrice()}</Text>
          )}

          <View style={styles.quantityControls}>
            {quantity > 0 ? (
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleDecrement}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleIncrement}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleIncrement}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {cartItem?.isWildcard && (
        <View style={styles.wildcardBanner}>
          <Text style={styles.wildcardText}>
            🎯 Pick for me: {cartItem.wildcardReason}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  culturalNotes: {
    fontSize: 13,
    color: '#16a34a',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spice: {
    fontSize: 14,
  },
  badges: {
    fontSize: 14,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  quantityControls: {
    alignItems: 'center',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 6,
    margin: 2,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 12,
  },
  addButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  wildcardBanner: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  wildcardText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
});