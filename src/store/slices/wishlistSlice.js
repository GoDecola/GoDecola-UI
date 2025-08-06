import { createSlice } from '@reduxjs/toolkit';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../actions/wishlistAction';
const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // lista de desejos
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.data ?? action.payload;
        state.items = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao carregar wishlist';
      })

      // adicionar item à wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const newItem = action.payload?.data ?? action.payload;

        if (!newItem) return;

        // evita duplicar item se já existir (compara por id)
        const exists = state.items.some((i) => i.id === newItem.id);
        if (!exists) {
          state.items.push(newItem);
        } else {
          state.items = state.items.map((i) => (i.id === newItem.id ? newItem : i));
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao adicionar item à wishlist';
      })

      //  remove item da wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload?.data ?? action.payload;
        state.items = state.items.filter((item) => item.id !== removedId);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao remover item da wishlist';
      })
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;