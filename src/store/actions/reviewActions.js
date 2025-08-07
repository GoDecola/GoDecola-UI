import { createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

export const fetchReviewsByPackageId = createAsyncThunk(
  'reviews/fetchByPackageId',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewsByPackageId(packageId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar as reviews.');
    }
  }
);

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

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await reviewService.updateReview(reviewId, reviewData, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao atualizar a review.');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await reviewService.deleteReview(reviewId, auth.token);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erro ao deletar a review.');
    }
  }
);