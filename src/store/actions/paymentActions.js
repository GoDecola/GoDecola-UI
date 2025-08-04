import { createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from '../../services/paymentService';

export const checkout = createAsyncThunk(
    'payments/checkout',
    async (methodInfo, { rejectWithValue }) => {
        try {
            const response = await paymentService.checkout(methodInfo);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erro ao processar checkout');
        }
    }
);

export const getAllPayments = createAsyncThunk(
    'payments/getAllPayments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await paymentService.getAllPayments();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar pagamentos');
        }
    }
);

export const getPaymentById = createAsyncThunk(
    'payments/getPaymentById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await paymentService.getPaymentById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erro ao buscar pagamento');
        }
    }
);