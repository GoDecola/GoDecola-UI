import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import travelPackagesReducer from './slices/travelPackagesSlice';
import bookingReducer from './slices/bookingSlice';
import paymentReducer from './slices/paymentSlice';
import reviewReducer from './slices/reviewSlice';
import wishlistReducer from './slices/wishlistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  travelPackages: travelPackagesReducer,
  bookings: bookingReducer,
  payments: paymentReducer,
  reviews: reviewReducer,
  wishlist: wishlistReducer,
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
  payments: {
    payments: [],
    paymentDetails: null,
    checkoutResult: null,
    loading: false,
    error: null,
  },
  reviews: {
    reviews: [],
    loading: false,
    error: null,
  },
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'travelPackages/uploadTravelPackageMedia/pending',
          'travelPackages/uploadTravelPackageMedia/fulfilled',
          'travelPackages/uploadTravelPackageMedia/rejected',
          'travelPackages/updateTravelPackageById/pending',
          'travelPackages/updateTravelPackageById/fulfilled',
          'travelPackages/updateTravelPackageById/rejected',
        ],
        ignoredPaths: [
          'payload.formData',
          'travelPackages.formData',
          'meta.arg.formData',
          'meta.arg.packageData',
        ],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
