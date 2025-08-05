import { createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../services/wishlistService';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await wishlistService.getAll(auth.token);
      console.log('Wishlist carregada:', response);
      return response;
    } catch (error) {
      console.error('Erro ao carregar wishlist:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (packageId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const newItem = await wishlistService.add(packageId, auth.token);
      console.log('Item adicionado à wishlist:', newItem);
      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar item à wishlist:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistId, { rejectWithValue }) => {
    try {
      await wishlistService.delete(wishlistId, auth.token); 
      console.log('Item removido da wishlist:', wishlistId);
      return wishlistId;
    } catch (error) {
      console.error('Erro ao remover item da wishlist:', error.message);
      return rejectWithValue(error.message);
    }
  }
);