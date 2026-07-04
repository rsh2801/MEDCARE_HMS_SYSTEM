import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import MessageForm from "../components/MessageForm";
import Departments from "../components/Departments";
import PageTransition from "../components/PageTransition";

const Home = () => {
  return (
    <PageTransition>
      <Hero
        title="Welcome to MedCare Medical Institute | Your Trusted Healthcare Provider"
        imageUrl="/hero.png"
      />
      <Biography imageUrl="/about.png" />
      <Departments />
      <MessageForm />
    </PageTransition>
  );
};

export default Home;
