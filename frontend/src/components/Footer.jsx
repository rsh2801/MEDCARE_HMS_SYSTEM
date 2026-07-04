import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday", time: "9:00 AM - 11:00 PM" },
    { id: 2, day: "Tuesday", time: "12:00 PM - 12:00 AM" },
    { id: 3, day: "Wednesday", time: "10:00 AM - 10:00 PM" },
    { id: 4, day: "Thursday", time: "9:00 AM - 9:00 PM" },
    { id: 5, day: "Monday", time: "3:00 PM - 9:00 PM" },
    { id: 6, day: "Saturday", time: "9:00 AM - 3:00 PM" },
  ];

  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-slate-700/50 pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Separator className="mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src="/logo.png" alt="MedCare" className="h-12 w-auto" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 text-sm">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-slate-500 dark:text-dark-text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Home
              </Link>
              <Link to="/appointment" className="text-sm text-slate-500 dark:text-dark-text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Appointment
              </Link>
              <Link to="/about" className="text-sm text-slate-500 dark:text-dark-text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                About
              </Link>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 text-sm">Hours</h4>
            <ul className="flex flex-col gap-2">
              {hours.map((element, index) => (
                <li
                  key={element.id}
                  className={`flex justify-between text-sm text-slate-500 dark:text-dark-text-muted rounded px-1 ${
                    index % 2 === 0 ? "bg-slate-50 dark:bg-slate-800/50" : ""
                  }`}
                >
                  <span className="w-28">{element.day}</span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 text-sm">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-dark-text-muted">
                <FaPhone className="text-primary-600 dark:text-primary-400 shrink-0" />
                <span>999-999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-dark-text-muted">
                <MdEmail className="text-primary-600 dark:text-primary-400 shrink-0" />
                <span>rs2022jee@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-dark-text-muted">
                <FaLocationArrow className="text-primary-600 dark:text-primary-400 shrink-0" />
                <span>Adityapur, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
