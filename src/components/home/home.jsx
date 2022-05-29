import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../common/pageSections/header";
import ActiveSites from "../activeSites/activeSites";

const Home = () => {
  let navigate = useNavigate();
  const handleAnnouncementBoxClick = () => {
    navigate("/predictions?tab=Active%20Competitions");
  };

  return (
    <div>
      <div
        className="single-card announcement clickable"
        onClick={handleAnnouncementBoxClick}
      >
        <h2>World Cup 2022 predictions are now live!!!</h2>
        <button className="btn btn-md btn-dark">Get Started</button>
      </div>
      <Header text="Welcome to Dosshouse" />
      <p>
        Dosshouse is a combination of personal projects, utilities, and links to
        my active sites. Please browse around and check them out.
      </p>
      <hr />
      <ActiveSites />
    </div>
  );
};

export default Home;
