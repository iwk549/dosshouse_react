import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";

import { IconContext } from "react-icons";
import HomeIcon from "./common/icons/homeIcon";
import SpotifyIcon from "./common/icons/spotifyIcon";

const Navbar = ({}) => {
  const getActiveLink = ({ isActive }) => {
    return isActive ? "nav-link active" : "nav-link";
  };

  return (
    <IconContext.Provider value={{ className: "nav-icon" }}>
      <nav className="main-nav">
        <NavLink className={getActiveLink} to="/home">
          <HomeIcon /> Home
        </NavLink>
        <NavLink className={getActiveLink} to="/spotify_api">
          <SpotifyIcon /> Spotify API
        </NavLink>
      </nav>
    </IconContext.Provider>
  );
};

export default Navbar;
