import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const reservationId = location.state?.reservationId;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verifica se o ID da reserva está presente
  if (!reservationId) {
    return <div>Erro: ID da reserva não encontrado.</div>;
  }

  // Função para processar o pagamento
  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5071/api/payment/checkout', {
       method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId,
          method: paymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Pagamento processado:', data);
        
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro no pagamento');
      }
    } catch (error) {
      setError('Erro na requisição: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CheckoutPage;