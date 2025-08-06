import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkout } from '../../store/actions/paymentActions';
import { clearError, clearCheckoutResult } from '../../store/slices/paymentSlice';
import { goToPaymentSuccess } from '../../routes/coordinator';
import './CheckoutPage.css'; // Arquivo CSS para estilos

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
    return (
      <div className="checkout-error">
        <div className="error-container">
          <h2>Erro</h2>
          <p>ID da reserva não encontrado.</p>
        </div>
      </div>
    );
  }

  return (

    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1 style={{ color: "var(--primary-text-color)", opacity: 0.6 }}>VAMOS DECOLAR</h1>
          <div className="reservation-info">
            <span className="reservation-label">ID da Reserva:</span>
            <span className="reservation-id">{reservationId}</span>
          </div>
        </div>

        <div className="checkout-form">
          <div className="payment-section">
            <h3 style={{ color: "var(--primary-text-color)", opacity: 0.6 }}>Métodos de Pagamento</h3>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="card"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-content">
                  <span className="payment-icon">💳</span>
                  <span>Cartão de Crédito</span>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="Boleto"
                  value="Boleto"
                  checked={paymentMethod === 'Boleto'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-content">
                  <span className="payment-icon">📄</span>
                  <span>Boleto Bancário</span>
                </div>
              </label>


              <label className="payment-option">
                <input
                  type="radio"
                  name="PIX"
                  value="PIX"
                  checked={paymentMethod === 'PIX'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-content">
                  <span className="payment-icon"></span>
                  <span>PIX</span>
                </div>
              </label>

            </div>
          </div>

          <div className="checkout-actions">
            <button 
              className={`checkout-button ${!paymentMethod || loading ? 'disabled' : ''}`}
              onClick={handlePayment} 
              disabled={!paymentMethod || loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Processando...
                </>
              ) : (
                'Confirmar Pagamento'
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error.message || error}</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default CheckoutPage;
