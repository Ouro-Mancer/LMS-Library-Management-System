import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import UpdateProfilePopup from "./popups/UpdateProfilePopup";
import { ToastContainer } from "react-toastify"
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchUserBorrowedBooks, fetchAllBorrowedBooks } from "./store/slices/borrowSlice";

const App = () => {

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllBooks());
  }, []);

  useEffect(() => {
    // console.log("Auth status:", isAuthenticated);
    // console.log("User:", user);

    if (isAuthenticated && user?.role === "User") {
      // console.log("Dispatching fetchUserBorrowedBooks");
      dispatch(fetchUserBorrowedBooks());
    }

    if (isAuthenticated && (user?.role === "Admin" || user?.role === "main-Admin")) {
      // console.log("Dispatching fetchAllUsers & fetchAllBorrowedBooks");
      dispatch(fetchAllUsers());
      dispatch(fetchAllBorrowedBooks());
    }
  }, [isAuthenticated, user?.role]);




  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/update-profile" element={<UpdateProfilePopup />} />
      </Routes>
      <ToastContainer theme="dark" />
    </Router>
  )
};

export default App;
