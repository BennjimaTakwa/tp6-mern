import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Défi 1 : on reprend le panier sauvegardé (ou un tableau vide)
  items: JSON.parse(localStorage.getItem('techstore_cart')) || [],
  totalCount: 0,
  totalPrice: 0,
  // Défi 2 : pourcentage de remise du code promo
  discountPercent: 0,
};

const recalculateTotals = (state) => {
  state.totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Défi 1 : sauvegarde après chaque modification
  localStorage.setItem('techstore_cart', JSON.stringify(state.items));
};

// Défi 1 : recalculer les totaux du panier rechargé
recalculateTotals(initialState);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        // Immer transforme cette mutation en une nouvelle copie de l'état
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      recalculateTotals(state);
    },
    removeItem: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.id !== action.payload);
        }
      }
      recalculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalPrice = 0;
      localStorage.setItem('techstore_cart', JSON.stringify(state.items));
    },
    // Défi 2 : 20 % de remise avec le code POLY2027, sinon aucune remise
    applyPromoCode: (state, action) => {
      if (action.payload === 'POLY2027') {
        state.discountPercent = 20;
      } else {
        state.discountPercent = 0;
      }
    },
  },
});

export const { addItem, removeItem, clearCart, applyPromoCode } = cartSlice.actions;
export default cartSlice.reducer;
