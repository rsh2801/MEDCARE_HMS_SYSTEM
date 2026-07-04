import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TiHome } from "react-icons/ti";
import { FaUserDoctor } from "react-icons/fa6";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { FiUser, FiLogIn } from "react-icons/fi";
import { Context } from "../main";

const BottomNav = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Home", icon: TiHome, path: "/" },
    { label: "Doctors", icon: FaUserDoctor, path: "/doctors" },
    { label: "Book", icon: FaCalendarPlus, path: "/appointment" },
    ...(isAuthenticated
      ? [{ label: "Bookings", icon: FaCalendarCheck, path: "/my-appointments" }]
      : []),
    isAuthenticated
      ? { label: "Profile", icon: FiUser, path: "/profile" }
      : { label: "Login", icon: FiLogIn, path: "/login" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigateTo(tab.path)}
            className="relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer"
          >
            {isActive(tab.path) && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <tab.icon
              className={`text-lg ${
                isActive(tab.path)
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            />
            <span
              className={`text-[10px] mt-0.5 ${
                isActive(tab.path)
                  ? "text-primary-600 dark:text-primary-400 font-medium"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
