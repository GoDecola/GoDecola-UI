import api from "./api";

const reviewService = {

  getReviewsByPackageId: (packageId) => {
    return api.get(`Review/travel-packages/${packageId}/reviews`); 
  },

  createReview: (reviewData, token) => {
    return api.post(`Review/travel-packages/${packageId}/reviews`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
};

export default reviewService;