import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "sonner";
import { Context } from "../main";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const location = useLocation();

  const handleLogout = async () => {
    await axios
      .get("http://localhost:5000/api/v1/user/admin/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();

  const navigate = (path) => {
    navigateTo(path);
    setShow(false);
  };

  const isActive = (path) => location.pathname === path;

  const iconClass = (path) =>
    `w-10 h-10 p-2 rounded-lg cursor-pointer transition-colors ${
      isActive(path)
        ? "bg-primary-600 text-white shadow-md shadow-primary-500/25"
        : "text-slate-300 hover:bg-sidebar-hover hover:text-white"
    }`;

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <motion.nav
        className="hidden xl:flex fixed top-0 left-0 h-full w-20 bg-gradient-to-b from-sidebar-bg to-primary-950 flex-col items-center py-6 gap-6 z-40"
        initial={{ x: -80 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <img src="/logo.png" alt="MedCare" className="h-10 w-10 mb-4" />
        <div className="flex flex-col items-center gap-4 flex-1 justify-center">
          <Tooltip content="Dashboard">
            <TiHome className={iconClass("/")} onClick={() => navigate("/")} />
          </Tooltip>
          <Tooltip content="Doctors">
            <FaUserDoctor className={iconClass("/doctors")} onClick={() => navigate("/doctors")} />
          </Tooltip>
          <Tooltip content="Add Admin">
            <MdAddModerator className={iconClass("/admin/addnew")} onClick={() => navigate("/admin/addnew")} />
          </Tooltip>
          <Tooltip content="Add Doctor">
            <IoPersonAddSharp className={iconClass("/doctor/addnew")} onClick={() => navigate("/doctor/addnew")} />
          </Tooltip>
          <Tooltip content="Messages">
            <AiFillMessage className={iconClass("/messages")} onClick={() => navigate("/messages")} />
          </Tooltip>
        </div>
        <div className="flex flex-col items-center gap-4">
          <ThemeToggle />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Tooltip content="Logout">
                <RiLogoutBoxFill className="w-10 h-10 p-2 rounded-lg cursor-pointer text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors" />
              </Tooltip>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout from the admin dashboard?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel />
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.nav>

      {/* Mobile hamburger */}
      <div className="xl:hidden fixed top-6 left-5 z-50">
        <button
          onClick={() => setShow(!show)}
          className="bg-sidebar-bg text-white p-2 rounded-lg shadow-lg"
        >
          <GiHamburgerMenu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
            />
            <motion.nav
              className="fixed top-0 left-0 h-full w-20 bg-gradient-to-b from-sidebar-bg to-primary-950 flex flex-col items-center py-6 gap-6 z-50 xl:hidden"
              initial={{ x: -80 }}
              animate={{ x: 0 }}
              exit={{ x: -80 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <img src="/logo.png" alt="MedCare" className="h-10 w-10 mb-4" />
              <div className="flex flex-col items-center gap-4 flex-1 justify-center">
                <TiHome className={iconClass("/")} onClick={() => navigate("/")} />
                <FaUserDoctor className={iconClass("/doctors")} onClick={() => navigate("/doctors")} />
                <MdAddModerator className={iconClass("/admin/addnew")} onClick={() => navigate("/admin/addnew")} />
                <IoPersonAddSharp className={iconClass("/doctor/addnew")} onClick={() => navigate("/doctor/addnew")} />
                <AiFillMessage className={iconClass("/messages")} onClick={() => navigate("/messages")} />
              </div>
              <div className="flex flex-col items-center gap-4">
                <ThemeToggle />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <RiLogoutBoxFill className="w-10 h-10 p-2 rounded-lg cursor-pointer text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to logout from the admin dashboard?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel />
                      <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
