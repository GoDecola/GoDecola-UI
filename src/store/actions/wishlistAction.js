import { createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../services/wishlistService';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.token) throw new Error('Token de autenticação não encontrado');
      const response = await wishlistService.getWishlist(auth.token);
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
      if (!packageId) throw new Error('packageId is required');
      const { auth } = getState();
      if (!auth.token) throw new Error('Token de autenticação não encontrado');
      const { wishlist } = getState();
      if (wishlist.items.some((item) => item.travelPackageId === packageId)) {
        return rejectWithValue("Item already in wishlist");
      }
      const newItem = await wishlistService.addToWishlist(packageId, auth.token);
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
  async (id, { rejectWithValue, dispatch }) => {
    try {
      if (!id) throw new Error('id is required');
      await wishlistService.deleteFromWishlist(id);
      console.log('Item removido da wishlist:', id);
      dispatch(fetchWishlist());
      return id;
    } catch (error) {
      console.error('Erro ao remover item da wishlist:', error.message);
      return rejectWithValue(error.message);
    }
  }
);