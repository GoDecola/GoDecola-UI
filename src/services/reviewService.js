import api from "./api";

const reviewService = {

  getReviewsByPackageId: (packageId) => {
    return api.get(`Review/travel-packages/${packageId}/reviews`); 
  },

  createReview: (reviewData, token) => {
    return api.post(`Review/${reviewData.travelPackageId}/reviews`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

   updateReview: (reviewId, reviewData, token) => {
    return api.put(`/Review/${reviewId}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` },
    });
  },

  deleteReview: (reviewId, token) => {
    return api.delete(`/Review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
  },

  getMyReviews: (token) => {
    return api.get(`/Review/users/me/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default reviewService;