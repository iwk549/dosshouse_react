import React from "react";
import { NavLink } from "react-router-dom";

import { IconContext } from "react-icons";
import HomeIcon from "./common/icons/homeIcon";
import SpotifyIcon from "./common/icons/spotifyIcon";
import { MdWebStories } from "react-icons/md";

const Navbar = () => {
  const getActiveLink = ({ isActive }) => {
    return isActive ? "nav-link active" : "nav-link";
  };

  return (
    <IconContext.Provider value={{ className: "nav-icon" }}>
      <nav className="main-nav">
        <div style={{ position: "absolute", top: 22 }}>
          <img
            src="/assets/profilePic.jpeg"
            height={40}
            width={40}
            alt="Ian Kendall"
            style={{ borderRadius: 10 }}
          />
        </div>
        <NavLink className={getActiveLink} to="/home">
          <HomeIcon /> Home
        </NavLink>
        <NavLink className={getActiveLink} to="/spotify_api">
          <SpotifyIcon /> Spotify API
        </NavLink>
        <NavLink className={getActiveLink} to="/active_sites">
          <MdWebStories /> Apps
        </NavLink>
      </nav>
    </IconContext.Provider>
  );
};

export default Navbar;
