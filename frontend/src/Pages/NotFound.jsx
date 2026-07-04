import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageTransition from "../components/PageTransition";

const NotFound = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-primary-600 dark:text-primary-400">
            404
          </h1>
          <div className="mt-4 mb-6">
            <svg
              className="mx-auto h-24 w-24 text-slate-300 dark:text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Page Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button size="lg">Go Home</Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
