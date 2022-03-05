import React from "react";
import { NavLink } from "react-router-dom";

import { IconContext } from "react-icons";
import HomeIcon from "./common/icons/homeIcon";
import SpotifyIcon from "./common/icons/spotifyIcon";
import { BiLinkExternal } from "react-icons/bi";

const imageStyle = {
  width: "auto",
  height: 25,
  borderRadius: 5,
};

const Navbar = () => {
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
        <a
          className="nav-link"
          href="https://ultimatescoreboard.com"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/assets/ultimateScoreboardLogo.ico"
            alt="Ultimate Scoreboard"
            style={imageStyle}
          />{" "}
          Ultimate Scoreboard <BiLinkExternal />
        </a>
        <a
          className="nav-link"
          href="http://structuremate.com/help"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/assets/StructureMateGuyInverted.png"
            alt="StructureMate"
            style={imageStyle}
          />{" "}
          StructureMate <BiLinkExternal />
        </a>
      </nav>
    </IconContext.Provider>
  );
};

export default Navbar;
