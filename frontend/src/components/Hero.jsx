import React from "react";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h4 className="hero-title">{title}</h4>
          <p className="hero-text">
          MEDCARE Medical Institute is a cutting-edge center devoted  
          to offering complete healthcare services with empathy and  
          professional excellence. Our dedicated team of qualified experts  
          focuses on delivering customized care designed around each  
          individual's specific needs. At MedCare, your health is our  
          priority, guiding you through a smooth process.
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
