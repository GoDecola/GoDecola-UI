import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import HomePageAdmin from "../pages/Home/HomePageAdmin/HomePageAdmin";
import HomePageSupport from "../pages/Home/HomePageSupport/HomePageSupport";
import ErrorPage from "../pages/Error/ErrorPage";
import SignUpPage from "../pages/SignUp/SignUpPage";
import LoginPage from "../pages/Login/LoginPage";
import RecPasswordEmailPage from "../pages/RecPasswordEmail/RecPassMailPage";
import RecoveryPasswordPage from "../pages/RecoveryPassword/RecoveryPasswordPage";
import PackageDetailsPage from "../pages/PackageDetails/PackageDetailsPage";
import SearchPackagesPage from "../pages/SearchPackages/SearchPackagesPage";
import AllReviewsPage from "../pages/Review/AllReviewsPage";
import BookingPage from "../pages/Booking/BookingPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import WishListPage from "../pages/WishList/WishListPage";
import HistoryPage from "../pages/History/HistoryPage";
import MainLayout from "../components/Layout";
import PrivateRoute from "../components/PrivateRoute";
import UnauthorizedPage from '../pages/Unauthorized/UnauthorizedPage'

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<RecPasswordEmailPage />} />
        <Route path="reset-password" element={<RecoveryPasswordPage />} />
        <Route path="package-details/:id" element={<PackageDetailsPage />} />
        <Route path="search-packages" element={<SearchPackagesPage />} />
        <Route path="all-reviews" element={<AllReviewsPage />} />
        <Route
          path="booking"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <PrivateRoute>
              <WishListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="history"
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="home-admin"
          element={
            <PrivateRoute roleRequired="ADMIN">
              <HomePageAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="home-support"
          element={
            <PrivateRoute roleRequired="SUPPORT">
              <HomePageSupport />
            </PrivateRoute>
          }
        />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};
