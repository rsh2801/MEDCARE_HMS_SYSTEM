import React from "react";
import { motion } from "framer-motion";

const Biography = ({ imageUrl }) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={imageUrl}
            alt="who we are"
            className="w-full max-w-md rounded-2xl shadow-lg dark:shadow-slate-900/50"
          />
        </motion.div>
        <motion.div
          className="space-y-4 bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-primary-600 dark:text-primary-400 font-semibold tracking-wide">
            Biography
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Who We Are
          </h3>
          <p className="text-slate-600 dark:text-dark-text-muted leading-relaxed">
            MedCare Medical Institute is dedicated to delivering high-quality
            healthcare with compassion and professionalism. Our experienced
            doctors and staff work closely with each patient to ensure proper
            diagnosis, effective treatment, and complete care. We offer a wide
            range of medical services and are committed to maintaining the
            highest standards of safety and excellence. Whether you need routine
            consultation or specialized procedures our goal is to support your
            wellness journey with integrity, innovation, and trust. Your health
            is always our priority.
          </p>
          <p className="text-slate-600 dark:text-dark-text-muted font-medium">
            Not For Me But For You!
          </p>
          <p className="text-slate-600 dark:text-dark-text-muted font-medium">
            We are working For a HEALTHY India.
          </p>
          <p className="text-slate-600 dark:text-dark-text-muted leading-relaxed">
            At MedCare Medical Institute, we are proud to have a team of highly
            qualified doctors and specialists who bring years of clinical
            experience and dedication to patient care. Each professional is
            committed to delivering personalized treatment backed by compassion
            and medical excellence. Alongside our expert team, we utilize
            advanced medical technology and diagnostic tools to ensure precision,
            safety, and efficiency in every procedure. Whether it's routine care
            or complex treatment, MedCare combines trusted medical expertise
            with innovation to give you the best possible outcomes.
          </p>
          <p className="text-slate-600 dark:text-dark-text-muted font-medium">Be Healthy</p>
          <p className="text-slate-600 dark:text-dark-text-muted font-medium">Be safe!</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Biography;
