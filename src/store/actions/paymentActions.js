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

// Crie um middleware de listener
const listenerMiddleware = createListenerMiddleware();

// Função para configurar o middleware com navigate (injetado no setup)
export const setupCheckoutMiddleware = (navigate) => {
  listenerMiddleware.startListening({
    actionCreator: checkout.fulfilled,
    effect: (action, listenerApi) => {
      const state = listenerApi.getState();
      const paymentMethod = state.payments.paymentMethod; // Supondo que paymentMethod está no estado
      const { redirectUrl } = action.payload;

      if (paymentMethod === 'card' && redirectUrl) {
        console.log('Redirecionando para Stripe (middleware):', redirectUrl);
        window.location.href = redirectUrl;
      }
    },
  });
};

export default listenerMiddleware;