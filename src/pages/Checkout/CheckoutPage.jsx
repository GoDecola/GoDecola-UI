import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkout } from '../../store/actions/paymentActions';
import { clearError, clearCheckoutResult } from '../../store/slices/paymentSlice';
import { goToPaymentSuccess } from '../../routes/coordinator';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reservationId = location.state?.reservationId;
  const [paymentMethod, setPaymentMethod] = useState('');

  // Estados do Redux
  const { checkoutResult, loading, error } = useSelector((state) => state.payments);

  // Limpar erro ao montar o componente e resultado ao desmontar
  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearCheckoutResult());
    };
  }, [dispatch]);

  // Redirecionar após checkout
  useEffect(() => {
    if (checkoutResult) {
      console.log('Pagamento processado:', checkoutResult);
      const { redirectUrl, status, reservationId: resultReservationId } = checkoutResult;

      if (redirectUrl && status === 'PENDING') {
        // Redirecionar para o Stripe checkout
        window.location.href = redirectUrl;
      } else if (resultReservationId) {
        // Usar reservationId para navegar para a página de sucesso
        goToPaymentSuccess(navigate, resultReservationId);
      } else {
        console.error('reservationId não encontrado em checkoutResult:', checkoutResult);
        navigate('/error', { state: { message: 'ID da reserva não encontrado no resultado do pagamento' } });
      }
    }
  }, [checkoutResult, navigate]);

  // Função para processar o pagamento
  const handlePayment = async () => {
    const methodInfo = {
      reservationId,
      method: paymentMethod,
    };
    await dispatch(checkout(methodInfo));
  };

  if (!reservationId) {
    return <div>Erro: ID da reserva não encontrado.</div>;
  }

  return (
    <div>
      <h1>Página de Checkout</h1>
      <p>ID da Reserva: {reservationId}</p>
      <label>
        Método de Pagamento:
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="credit_card">Cartão de Crédito</option>
          <option value="debit_card">Cartão de Débito</option>
          <option value="boleto">Boleto</option>
        </select>
      </label>
      <button onClick={handlePayment} disabled={!paymentMethod || loading}>
        {loading ? 'Processando...' : 'Confirmar Pagamento'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message || error}</p>}
    </div>
  );
};

export default CheckoutPage;