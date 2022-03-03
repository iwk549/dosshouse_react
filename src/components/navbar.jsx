import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";

import { IconContext } from "react-icons";
import { BiHome } from "react-icons/bi";
import { BsSpotify } from "react-icons/bs";

const Navbar = ({}) => {
  const getActiveLink = ({ isActive }) => {
    return isActive ? "nav-link active" : "nav-link";
  };

  return (
    <IconContext.Provider value={{ className: "nav-icon" }}>
      <nav className="main-nav">
        <NavLink className={getActiveLink} to="/home">
          <BiHome /> Home
        </NavLink>
        <NavLink className={getActiveLink} to="/spotify_api">
          <BsSpotify /> Spotify API
        </NavLink>
      </nav>
    </IconContext.Provider>
  );
};

export default Navbar;
