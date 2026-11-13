import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'techstore_cart';
const PROMO_CODE = 'POLY2027';
const PROMO_PERCENT = 20;

// Challenge 1: load persisted items from localStorage
const loadItems = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Challenge 1: persist items to localStorage
const saveItems = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// Internal utility to recalculate totals
const recalculateTotals = (state) => {
  state.totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Challenge 2: discounted total
  state.discountAmount = (state.totalPrice * state.discountPercent) / 100;
  state.finalPrice = state.totalPrice - state.discountAmount;
};

const initialState = {
  items: loadItems(), // [{ id, name, price, quantity, icon, stock }]
  totalCount: 0, // Total quantity of items
  totalPrice: 0, // Subtotal in Tunisian Dinars (DT)
  discountPercent: 0, // Challenge 2
  discountAmount: 0,
  finalPrice: 0,
  promoStatus: 'idle', // 'idle' | 'applied' | 'invalid'
};
recalculateTotals(initialState);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Add item or increment quantity if existing
    addItem: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        // Challenge 3: never exceed available stock
        if (existing.stock !== undefined && existing.quantity >= existing.stock) return;
        existing.quantity += 1; // Direct mutation powered by Immer!
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      recalculateTotals(state);
      saveItems(state.items);
    },

    // 2. Decrement quantity or remove if reaching zero
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
      saveItems(state.items);
    },

    // 3. Clear cart
    clearCart: (state) => {
      state.items = [];
      state.discountPercent = 0;
      state.promoStatus = 'idle';
      recalculateTotals(state);
      saveItems(state.items);
    },

    // Challenge 2: promo code
    applyPromoCode: (state, action) => {
      const code = action.payload.trim().toUpperCase();
      if (code === PROMO_CODE) {
        state.discountPercent = PROMO_PERCENT;
        state.promoStatus = 'applied';
      } else {
        state.discountPercent = 0;
        state.promoStatus = 'invalid';
      }
      recalculateTotals(state);
    },
  },
});

export const { addItem, removeItem, clearCart, applyPromoCode } = cartSlice.actions;
export default cartSlice.reducer;
