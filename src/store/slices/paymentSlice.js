import { createSlice } from '@reduxjs/toolkit';
import { checkout, getAllPayments, getPaymentById, updatePaymentStatus } from '../actions/paymentActions';
import { logout } from './authSlice';

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    paymentDetails: null,
    checkoutResult: null,
    paymentSession: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Reducer para limpar o estado de erro, se necessário
    clearError: (state) => {
      state.error = null;
    },
    // Reducer para limpar o resultado do checkout
    clearCheckoutResult: (state) => {
      state.checkoutResult = null;
    },
  },
  extraReducers: (builder) => {
    // Checkout
    builder
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutResult = action.payload;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Get All Payments
    builder
      .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Get Payment By Id
    builder
      .addCase(getPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload;
      })
      .addCase(getPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update payment state
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const index = state.payments.findIndex((p) => p.id === id);
        if (index !== -1) {
          state.payments[index] = { ...state.payments[index], status };
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCheckoutResult } = paymentSlice.actions;
export default paymentSlice.reducer;