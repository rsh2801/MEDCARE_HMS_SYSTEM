import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = ({ title, imageUrl }) => {
  return (
    <section className="pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-base text-slate-600 dark:text-dark-text-muted leading-relaxed max-w-xl">
            MEDCARE Medical Institute is a cutting-edge center devoted to
            offering complete healthcare services with empathy and professional
            excellence. Our dedicated team of qualified experts focuses on
            delivering customized care designed around each individual's specific
            needs. At MedCare, your health is our priority, guiding you through
            a smooth process.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/appointment">
              <Button size="lg">Book Appointment</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <motion.img
            src={imageUrl}
            alt="hero"
            className="w-full max-w-md lg:max-w-lg"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
