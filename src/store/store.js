import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import travelPackagesReducer from './slices/travelPackagesSlice';
import bookingReducer from './slices/bookingSlice';
import paymentReducer from './slices/paymentSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  travelPackages: travelPackagesReducer,
  bookings: bookingReducer,
  payments: paymentReducer,
});

const loadToken = () => {
  try {
    return localStorage.getItem('token') || null;
  } catch (error) {
    console.error('Erro ao carregar token:', error);
    return null;
  }
};

const preloadedState = {
  auth: {
    token: loadToken(),
    userId: null,
    user: null,
    loading: false,
    error: null,
  },
  user: {
    user: null,
    loading: false,
    error: null,
  },
  travelPackages: {
    packages: [],
    packageDetails: null,
    loading: false,
    error: null,
  },
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  devTools: import.meta.env.MODE !== 'production',
});

export default store;