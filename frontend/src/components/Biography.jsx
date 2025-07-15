import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p className="biography-title">Biography</p>
          <h3 className="biography-heading">Who We Are</h3>
          <p className="biography-text">
            MedCare Medical Institute is dedicated to delivering high-quality 
            healthcare with compassion and professionalism. Our experienced doctors
            and staff work closely with each patient to ensure proper diagnosis,
            effective treatment, and complete care. We offer a wide range of medical
            services and are committed to maintaining the highest standards of safety 
            and excellence. Whether you need routine consultation or specialized procedures
            our goal is to support your wellness journey with integrity, innovation, and 
            trust. Your health is always our priority.
          </p>
          <p className="biography-text">Not For Me But For You!</p>
          <p className="biography-text">We are working For a HEALTHY India.</p>
          <p className="biography-text">
           At MedCare Medical Institute, we are proud to have a team of highly qualified 
           doctors and specialists who bring years of clinical experience and dedication to
           patient care. Each professional is committed to delivering personalized treatment
           backed by compassion and medical excellence. Alongside our expert team, we utilize
           advanced medical technology and diagnostic tools to ensure precision, safety, and
           efficiency in every procedure. Whether it's routine care or complex treatment, MedCare
           combines trusted medical expertise with innovation to give you the best possible outcomes.
          </p>
          <p className="biography-text">Be Healthy</p>
          <p className="biography-text">Be safe!</p>
        </div>
      </div>
    </>
  );
};

export default Biography;
