import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App';
import { useCartStore } from '../store/cartStore';
import { MenuItem } from '../types';

type OrderSummaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderSummary'>;

export default function OrderSummaryScreen() {
  const navigation = useNavigation<OrderSummaryScreenNavigationProp>();

  const cart = useCartStore((state) => state.cart);
  const menu = useCartStore((state) => state.menu);
  const clear = useCartStore((state) => state.clear);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

  // Get all menu items for lookup
  const allItems = menu?.sections.flatMap(section =>
    section.items.map(item => ({ ...item, sectionId: section.id }))
  ) || [];

  const cartItems = Object.values(cart).map(cartItem => {
    const menuItem = allItems.find(item => item.id === cartItem.itemId);
    return {
      ...cartItem,
      menuItem,
    };
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    if (item.menuItem?.price) {
      return sum + (item.menuItem.price.amount * item.quantity);
    }
    return sum;
  }, 0);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClearAll = () => {
    clear();
  };

  const handleIncrement = (sectionId: string, itemId: string) => {
    increment(sectionId, itemId);
  };

  const handleDecrement = (itemId: string) => {
    decrement(itemId);
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Order Summary</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your order is empty</Text>
          <Text style={styles.emptySubtext}>Add some items from the menu</Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleBack}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Order Summary</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {totalItems} items • ${totalPrice.toFixed(2)}
          </Text>
        </View>

        {cartItems.map((cartItem) => (
          <OrderItemCard
            key={cartItem.itemId}
            cartItem={cartItem}
            onIncrement={() => handleIncrement(cartItem.sectionId, cartItem.itemId)}
            onDecrement={() => handleDecrement(cartItem.itemId)}
          />
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>
            Ready to Order 🎉
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface OrderItemCardProps {
  cartItem: {
    itemId: string;
    quantity: number;
    sectionId: string;
    isWildcard?: boolean;
    wildcardReason?: string;
    menuItem?: MenuItem & { sectionId: string };
  };
  onIncrement: () => void;
  onDecrement: () => void;
}

function OrderItemCard({ cartItem, onIncrement, onDecrement }: OrderItemCardProps) {
  const { menuItem, quantity, isWildcard, wildcardReason } = cartItem;

  if (!menuItem) {
    return null;
  }

  const itemTotal = menuItem.price ? menuItem.price.amount * quantity : 0;

  return (
    <View style={styles.orderItem}>
      <View style={styles.orderItemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{menuItem.translatedName}</Text>
          {menuItem.price && (
            <Text style={styles.itemPrice}>${menuItem.price.amount} each</Text>
          )}
          {isWildcard && wildcardReason && (
            <Text style={styles.wildcardReason}>
              🎯 {wildcardReason}
            </Text>
          )}
        </View>

        <View style={styles.itemControls}>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onDecrement}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onIncrement}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          {menuItem.price && (
            <Text style={styles.itemTotal}>${itemTotal.toFixed(2)}</Text>
          )}
        </View>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 80,
  },
  clearText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  wildcardReason: {
    fontSize: 12,
    color: '#92400e',
    fontStyle: 'italic',
  },
  itemControls: {
    alignItems: 'flex-end',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 6,
    margin: 2,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 12,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  bottomPadding: {
    height: 120,
  },
  footer: {
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  checkoutButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});