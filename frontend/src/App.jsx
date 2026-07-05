import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GradientBackground from "./components/GradientBackground";
import SonnerToaster from "./components/SonnerToaster";
import TopProgressBar from "./components/TopProgressBar";
import ScrollToTop from "./components/ScrollToTop";
import BottomNav from "./components/BottomNav";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";
import MyAppointments from "./Pages/MyAppointments";
import OurDoctors from "./Pages/OurDoctors";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import ForgotPassword from "./Pages/ForgotPassword";
import Chatbot from "./components/Chatbot";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/doctors" element={<OurDoctors />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/patient/me`,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        console.log("User not authenticated:", error.response?.data?.message);
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Router>
        <TopProgressBar />
        <GradientBackground />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <ScrollToTop />
        <BottomNav />
        <Chatbot />
        <SonnerToaster />
      </Router>
    </>
  );
};

export default App;
