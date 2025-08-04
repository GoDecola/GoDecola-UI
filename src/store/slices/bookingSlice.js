import { createSlice } from '@reduxjs/toolkit';
import { fetchBookings, fetchBookingById, createBooking } from '../actions/bookingActions';
import { logout } from './authSlice';

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    bookingDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBookingDetails: (state) => {
      state.bookingDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao buscar reservas';
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingDetails = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao buscar detalhes da reserva';
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        // A lista será atualizada por fetchBookings
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao criar reserva';
      }) 
  },
});

export const { clearBookingDetails } = bookingSlice.actions;
export default bookingSlice.reducer;