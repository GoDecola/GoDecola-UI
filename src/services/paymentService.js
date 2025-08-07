import api from "./api";

const paymentService = {
  checkout: async (methodInfo) => {
    const response = await api.post("/payment/checkout", methodInfo);
    return response.data;
  },

  getAllPayments: async () => {
    const response = await api.get("/payment/admin/list");
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payment/admin/${id}`);
    return response.data;
  },

  statusUpdate: async (paymentId, status) => {
    await api.patch(`/payment/${paymentId}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`Payment status updated: ${paymentId} to ${status}`);
    return { id: paymentId, status };
  }
};

export default paymentService;