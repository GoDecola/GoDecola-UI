export const goToHome = (navigate) => {
  navigate("/");
};

export const goToError = (navigate) => {
  navigate("*");
};

export const goToLogin = (navigate) => {
  navigate("/login");
};

export const goToForgotPassword = (navigate) => {
  navigate("/forgot-password");
};

export const goToResetPassword = (navigate) => {
  navigate("/reset-password");
};

export const goToSignUp = (navigate) => {
  navigate("/signup");
};

export const goToPackageDetails = (navigate, id) => {
  navigate(`/package-details/${id}`);
};

export const goToSearchPackages = (navigate) => {
  navigate("/search-packages");
};

export const goToReviews = (navigate, packageId, commentId) => {
  navigate(`/all-reviews?packageId=${packageId}&highlightId=${commentId}`);
};

export const goToBookings = (navigate, packageData) => {
  navigate("/booking", { state: { packageData } });
};

export const goBack = (navigate) => {
  navigate(-1);
};

export const goToHomeAdmin = (navigate) => {
  navigate("/home-admin");
};

export const goToProfile = (navigate) => {
  navigate("/profile");
};

export const goToWishList = (navigate) => {
  navigate("/wishlist");
};

export const goToHistory = (navigate) => {
  navigate("/history");
};

export const goToHomeSupport = (navigate) => {
  navigate("/home-support");
};

export const goToCheckout = (navigate, reservationId) => {
  navigate('/checkout', { state: { reservationId } });
};
export const goToPaymentSuccess = (navigate) => {
  navigate("/payment-success");
};

export const goToPaymentCancel = (navigate) => {
  navigate("/payment-cancel");
};