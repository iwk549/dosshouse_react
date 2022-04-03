import React from "react";
import { NavLink } from "react-router-dom";

import { IconContext } from "react-icons";
import HomeIcon from "./common/icons/homeIcon";
import SpotifyIcon from "./common/icons/spotifyIcon";
import { MdWebStories } from "react-icons/md";
import PredictionsIcon from "./common/icons/predictionsIcon";

const Navbar = () => {
  const getActiveLink = ({ isActive }) => {
    return isActive ? "nav-link active" : "nav-link";
  };

  return (
    <IconContext.Provider value={{ className: "nav-icon" }}>
      <div
        style={{
          float: "left",
          marginLeft: 20,
          marginTop: 5,
        }}
      >
        <img
          src="/assets/profilePic.jpeg"
          height={50}
          width={50}
          alt="Ian Kendall"
          style={{ borderRadius: 10 }}
        />
      </div>
      <nav className="main-nav">
        <NavLink className={getActiveLink} to="/home">
          <HomeIcon /> Home
        </NavLink>
        <NavLink className={getActiveLink} to="/spotify_api">
          <SpotifyIcon /> Spotify API
        </NavLink>
        <NavLink className={getActiveLink} to="/predictions">
          <PredictionsIcon /> Predictions
        </NavLink>
        <NavLink className={getActiveLink} to="/active_sites">
          <MdWebStories /> Apps
        </NavLink>
      </nav>
    </IconContext.Provider>
  );
};

export default Navbar;
