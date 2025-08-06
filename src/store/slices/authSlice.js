import { createSlice } from '@reduxjs/toolkit';
import { parseJwt } from '../../utils/jwt';

const initialState = {
  token: localStorage.getItem('token') || null,
  userId: null,
  user: null,
  role: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      const decodedToken = parseJwt(action.payload.token);
      state.role = decodedToken ? decodedToken.role : null;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.user = null;
      state.role = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;