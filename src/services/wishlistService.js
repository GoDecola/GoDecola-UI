import api from "./api";

const wishlistService = {
  getAll: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  add: async (packageId) => {
    const response = await api.post('/wishlist', { packageId });
    return response.data;
  },

  delete: async (wishlistId) => {
    await api.delete(`/wishlist/${wishlistId}`);
  }
};

export default wishlistService;