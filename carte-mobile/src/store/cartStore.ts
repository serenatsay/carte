import { create } from 'zustand';
import { CartSelectionItem, ParsedMenu, WildcardSelection } from '../types';

interface CartState {
  preferredLanguage: string;
  menu: ParsedMenu | null;
  cart: Record<string, CartSelectionItem>; // key by itemId
  setPreferredLanguage: (lang: string) => void;
  setMenu: (menu: ParsedMenu | null) => void;
  increment: (sectionId: string, itemId: string) => void;
  decrement: (itemId: string) => void;
  clear: () => void;
  addWildcardSelections: (selections: WildcardSelection[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
  preferredLanguage: 'English',
  menu: null,
  cart: {},
  setPreferredLanguage: (preferredLanguage) => set({ preferredLanguage }),
  setMenu: (menu) => set({ menu, cart: {} }),
  increment: (sectionId, itemId) =>
    set((state) => {
      const existing = state.cart[itemId];
      const quantity = (existing?.quantity ?? 0) + 1;
      return {
        cart: {
          ...state.cart,
          [itemId]: {
            itemId,
            quantity,
            sectionId,
            isWildcard: existing?.isWildcard,
            wildcardReason: existing?.wildcardReason,
          },
        },
      };
    }),
  decrement: (itemId) =>
    set((state) => {
      const existing = state.cart[itemId];
      if (!existing) return {} as any;
      const quantity = existing.quantity - 1;
      const newCart = { ...state.cart };
      if (quantity <= 0) delete newCart[itemId];
      else newCart[itemId] = { ...existing, quantity };
      return { cart: newCart };
    }),
  clear: () => set({ cart: {} }),
  addWildcardSelections: (selections) =>
    set((state) => {
      const newCart = { ...state.cart };
      for (const selection of selections) {
        const existing = newCart[selection.itemId];
        const newQuantity = (existing?.quantity || 0) + selection.quantity;
        newCart[selection.itemId] = {
          itemId: selection.itemId,
          quantity: newQuantity,
          sectionId: selection.sectionId,
          isWildcard: true,
          wildcardReason: selection.reason,
        };
      }
      return { cart: newCart };
    }),
}));