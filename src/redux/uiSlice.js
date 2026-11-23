import { createSlice } from '@reduxjs/toolkit';

// Défi 3 : une deuxième slice pour l'interface (la notification)
const initialState = {
  message: '',
  visible: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload;
      state.visible = true;
    },
    hideToast: (state) => {
      state.message = '';
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
