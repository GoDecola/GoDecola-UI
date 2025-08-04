import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrentUser, fetchUsers, fetchUserByIdOrDocument, fetchBookingByUserId, createUser, updateUserById, deleteUserById } from '../actions/userActions';
import { logout } from './authSlice';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    users: [],
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.users = [];
      state.bookings = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao buscar usuário atual';
      })
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao buscar usuários';
      })
      // fetchUserByIdOrDocument
      .addCase(fetchUserByIdOrDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdOrDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserByIdOrDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao buscar usuário';
      })
      // fetchBookingByUserId
      .addCase(fetchBookingByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao buscar reservas';
      })
      // createUser
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && action.payload.id === state.user.id) {
          state.user = {
            ...state.user,
            ...action.payload,
          };
        }
        state.users = state.users.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload } : u
        );
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao criar usuário';
      })
      // updateUserById
      .addCase(updateUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.id && state.user?.id === action.payload.id) {
          state.user = {
            ...state.user,
            ...action.payload,
          };
        }
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao atualizar usuário';
      })
      // deleteUserById
      .addCase(deleteUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.loading = false;
        // Lista atualizada por fetchUsers
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao excluir usuário';
      })
      // logout
      .addCase(logout, (state) => {
        state.user = null;
        state.users = [];
        state.bookings = [];
        state.error = null;
        state.loading = false;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;