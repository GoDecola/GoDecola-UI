import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      if (!userData) throw new Error('userData is required');
      console.log('Sending signup request with:', userData);
      const response = await authService.signup(userData);
      console.log('Signup response:', response);
      return response;
    } catch (error) {
      console.error('Signup error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);