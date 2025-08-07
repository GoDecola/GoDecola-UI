import { createSlice } from '@reduxjs/toolkit';
import { fetchReviewsByPackageId, createReview, updateReview, deleteReview  } from '../actions/reviewActions';

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByPackageId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByPackageId.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByPackageId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reviews = [];
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload; 
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
      })
  },
});

 export const selectTransformedReviews = (state) => {
  const rawReviews = state.reviews.reviews;

  return Array.isArray(rawReviews) ? rawReviews.map(review => {
    const userExists = review.user;
    const userName = userExists ? `${review.user.firstName} ${review.user.lastName}`.trim() : 'Usuário Anônimo';
    const createdAt = userExists ? review.user.createdAt : null;
    const userId = userExists ? review.user.id : null;

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      packageId: review.travelPackageId,
      isEdited: review.isEdited,
      reviewDate: review.reviewDate,
      userName: userName,
      createdAt: createdAt,
      userId: userId,
    };
  }) : [];
};

export default reviewSlice.reducer;