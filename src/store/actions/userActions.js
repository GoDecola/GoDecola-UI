import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';
import { getToken, parseJwt } from '../../utils/jwt';
import { getAvatarUrl } from '../../services/avatarService';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Token não encontrado');
      const decoded = parseJwt(token);
      const userId = decoded?.nameid || decoded?.sub;
      if (!userId) throw new Error('ID do usuário não encontrado no token');
      const userData = await userService.getUserByIdOrDocument(userId);
      const normalizedUserData = userData.data || userData;
      const userWithAvatar = {
        ...normalizedUserData,
        avatar: getAvatarUrl(normalizedUserData.firstName, normalizedUserData.lastName),
      };
      console.log('Usuário recuperado:', userWithAvatar);
      return userWithAvatar;
    } catch (error) {
      console.error('Fetch user error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await userService.getUsers(auth.token);
      console.log('Usuários recuperados:', response);
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserByIdOrDocument = createAsyncThunk(
  'user/fetchUserByIdOrDocument',
  async (idOrDocument, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await userService.getUserByIdOrDocument(idOrDocument, auth.token);
      const normalizedUserData = response.data || response;
      const userWithAvatar = {
        ...normalizedUserData,
        avatar: getAvatarUrl(normalizedUserData.firstName, normalizedUserData.lastName),
      };
      console.log('Usuário recuperado:', userWithAvatar);
      return userWithAvatar;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchBookingByUserId = createAsyncThunk(
  'user/fetchBookingByUserId',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await userService.getBookingByUserId(userId, auth.token);
      console.log('Reservas recuperadas:', response);
      return response;
    } catch (error) {
      console.error('Erro ao buscar reservas:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      const response = await userService.createUser(userData, auth.token);
      console.log('Usuário criado:', response);
      dispatch(fetchUsers());
      return response;
    } catch (error) {
      console.error('Erro ao criar usuário:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserById = createAsyncThunk(
  'user/updateUserById',
  async ({ id, userData }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('No authentication token found');
      }
      const response = await userService.updateUserById(id, userData, auth.token);
      console.log('Usuário atualizado:', response);

      await dispatch(fetchCurrentUser());

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'user/deleteUserById',
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      await userService.deleteUserById(id, auth.token);
      console.log('Usuário excluído:', id);
      dispatch(fetchUsers());
      return id;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);