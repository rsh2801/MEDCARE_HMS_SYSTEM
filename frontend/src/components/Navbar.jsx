import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { Context } from "../main";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const goToLogin = () => {
    navigateTo("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-primary-600 dark:text-primary-400"
        : "text-slate-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
    }`;

  const mobileLinkClass = (path) =>
    `text-lg font-medium transition-colors ${
      isActive(path)
        ? "text-primary-600 dark:text-primary-400"
        : "text-slate-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200 dark:bg-dark-surface dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <Link to="/">
            <img src="/logo.png" alt="MedCare" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/appointment" className={linkClass("/appointment")}>Appointment</Link>
          <Link to="/about" className={linkClass("/about")}>About Us</Link>
          <Link to="/doctors" className={linkClass("/doctors")}>Our Doctors</Link>
          <ThemeToggle />
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <Button onClick={goToLogin}>Login</Button>
          )}
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <Button variant="ghost" size="icon">
                <GiHamburgerMenu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-12">
              <div className="flex flex-col gap-6 mt-6">
                <div onClick={() => setSheetOpen(false)} className="flex flex-col gap-4">
                  <Link to="/" className={mobileLinkClass("/")}>Home</Link>
                  <Link to="/appointment" className={mobileLinkClass("/appointment")}>Appointment</Link>
                  <Link to="/about" className={mobileLinkClass("/about")}>About Us</Link>
                  <Link to="/doctors" className={mobileLinkClass("/doctors")}>Our Doctors</Link>
                  {isAuthenticated && (
                    <Link to="/my-appointments" className={mobileLinkClass("/my-appointments")}>My Appointments</Link>
                  )}
                </div>
                {isAuthenticated ? (
                  <ProfileDropdown />
                ) : (
                  <Button onClick={() => { goToLogin(); setSheetOpen(false); }}>Login</Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
