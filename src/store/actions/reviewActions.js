import { createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

export const fetchReviewsByPackageId = createAsyncThunk(
  'reviews/fetchByPackageId',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewsByPackageId(packageId);
      // Supondo que a API retorna um array de reviews em response.data
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar as reviews.');
    }
  }
);

// Action para criar uma review
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ reviewData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await reviewService.createReview(reviewData, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao criar a review.');
    }
  }
);
