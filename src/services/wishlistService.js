import api from "./api";

const wishlistService = {
  getWishlist: async () => {
    try {
      console.log("Fetching wishlist from /api/wishlist, Base URL:", api.defaults.baseURL);
      const response = await api.get("/wishlist");
      console.log("Wishlist response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get wishlist error:", error.message, error.response?.status, error.response?.data);
      throw new Error(`Failed to fetch wishlist: ${error.message}`);
    }
  },

  addToWishlist: async (packageId) => {
    try {
      if (!packageId) throw new Error("packageId is required");
      console.log("Sending POST to /wishlist with payload:", { travelPackageId: packageId }, "Base URL:", api.defaults.baseURL);
      const response = await api.post("/wishlist", { travelPackageId: packageId });
      console.log("Add to wishlist response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Add to wishlist error:", error.message, error.response?.status, error.response?.data);
      throw new Error(`Failed to add to wishlist: ${error.message}`);
    }
  },

  deleteFromWishlist: async (id) => {
    try {
      if (!id) throw new Error("id is required");
      console.log("Sending DELETE to /wishlist/", id, "Base URL:", api.defaults.baseURL);
      const response = await api.delete(`/wishlist/${id}`);
      console.log("Delete from wishlist response:", response.data);
      return true;
    } catch (error) {
      console.error("Delete from wishlist error:", error.message, error.response?.status, error.response?.data);
      throw new Error(`Failed to delete from wishlist: ${error.message}`);
    }
  },
};

export default wishlistService;