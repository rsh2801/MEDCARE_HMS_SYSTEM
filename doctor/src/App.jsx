import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Appointments from "./components/Appointments";
import Profile from "./components/Profile";
import { Context } from "./main";
import axios from "axios";
import SonnerToaster from "./components/SonnerToaster";
import TopProgressBar from "./components/TopProgressBar";
import Sidebar from "./components/Sidebar";
import NotFound from "./components/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setDoctor } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctor/me`,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setDoctor(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setDoctor({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <TopProgressBar />
      <Sidebar />
      <AnimatedRoutes />
      <SonnerToaster />
    </Router>
  );
};

export default App;
