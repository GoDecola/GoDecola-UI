export const goToHome = (navigate) => {
  navigate("/");
};

export const goToError = (navigate) => {
  navigate("*");
};

export const goToLogin = (navigate) => {
  navigate("/login");
};

export const goToRecPassMail = (navigate) => {
  navigate("/recpassmail");
};

export const goToRecoveryPassword = (navigate) => {
  navigate("/recoverypassword");
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

export const goToPaymentSuccess = (navigate, paymentId) => {
  navigate(`/payment/success/${paymentId}`);
};

export const goToPaymentPending = (navigate, paymentId) => {
  navigate(`/payment/pending/${paymentId}`);
};

export const goToPaymentFailure = (navigate, paymentId = "") => {
  if (paymentId) {
    navigate(`/payment/failure/${paymentId}`);
  } else {
    navigate("/payment/failure");
  }
};
