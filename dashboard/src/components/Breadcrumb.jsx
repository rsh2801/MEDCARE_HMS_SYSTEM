import React from "react";
import { useLocation, Link } from "react-router-dom";

const routeNames = {
  "/": "Dashboard",
  "/doctors": "Doctors",
  "/messages": "Messages",
  "/doctor/addnew": "Add Doctor",
  "/admin/addnew": "Add Admin",
};

const Breadcrumb = () => {
  const location = useLocation();
  const currentName = routeNames[location.pathname] || "Page";

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-dark-text-muted mb-6">
      <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11 2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Home
      </Link>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
      </svg>
      <span className="text-slate-800 dark:text-slate-200 font-medium">{currentName}</span>
    </nav>
  );
};

export default Breadcrumb;
