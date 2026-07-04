import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import PageTransition from "../components/PageTransition";

const AboutUs = () => {
  return (
    <PageTransition>
      <Hero
        title="Learn More About Us | MedCare Medical Institute"
        imageUrl="/about.png"
      />
      <Biography imageUrl="/whoweare.png" />
    </PageTransition>
  );
};

export default AboutUs;
