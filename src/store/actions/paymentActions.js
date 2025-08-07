import { createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from '../../services/paymentService';
import { createListenerMiddleware } from '@reduxjs/toolkit';


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

export const updatePaymentStatus = createAsyncThunk(
    'payments/updatePaymentStatus',
    async ({ paymentId, status }, { rejectWithValue }) => {
        try {
            const result = await paymentService.statusUpdate(paymentId, status);
            return result; // Returns { id: paymentId, status }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erro ao atualizar status do pagamento');
        }
    }
);

// Middleware de listener
const listenerMiddleware = createListenerMiddleware();

// Função para configurar o middleware com navigate (injetado no setup)
export const setupCheckoutMiddleware = (navigate) => {
    listenerMiddleware.startListening({
        actionCreator: checkout.fulfilled,
        effect: (action, listenerApi) => {
            const state = listenerApi.getState();
            const paymentMethod = state.payments.paymentMethod;
            const { redirectUrl } = action.payload;

            if (paymentMethod === 'card' && redirectUrl) {
                console.log('Redirecionando para Stripe (middleware):', redirectUrl);
                window.location.href = redirectUrl;
            }
        },
    });
};

export default listenerMiddleware;