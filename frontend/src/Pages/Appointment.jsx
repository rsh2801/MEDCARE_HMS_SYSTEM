import React from "react";
import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";
import PageTransition from "../components/PageTransition";

const Appointment = () => {
  return (
    <PageTransition>
      <Hero
        title="Schedule Your Appointment | MedCare Medical Institute"
        imageUrl="/signin.png"
      />
      <AppointmentForm />
    </PageTransition>
  );
};

export default Appointment;
