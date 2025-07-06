import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  position?: 'top' | 'bottom';
}

interface ToastState {
  toast: Toast | null;
}

const initialState: ToastState = {
  toast: null,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<Toast>) {
      state.toast = action.payload;
    },
    hideToast(state) {
      state.toast = null;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;