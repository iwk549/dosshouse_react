import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { IconContext } from "react-icons";
import IconRender from "./common/icons/iconRender";
import Confirm from "./common/modal/confirm";
import { logout } from "../services/userService";
import LoadingContext from "../context/loadingContext";
import RegistrationModalForm from "./user/registrationModalForm";

const Navbar = () => {
  const { user, setUser, setLoading } = useContext(LoadingContext);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);

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
          <IconRender type="home" /> Home
        </NavLink>
        <NavLink className={getActiveLink} to="/predictions">
          <IconRender type="prediction" /> Predictions
        </NavLink>
        <NavLink className={getActiveLink} to="/spotify_api">
          <IconRender type="spotify" /> Spotify
        </NavLink>
        <NavLink className={getActiveLink} to="/active_sites">
          <IconRender type="app" /> Apps
        </NavLink>
      </nav>
      <div
        style={{
          position: "absolute",
          right: 50,
          top: 30,
        }}
      >
        <button
          className={"btn btn-sm btn-" + (user ? "danger" : "dark")}
          onClick={() =>
            user ? setLogoutOpen(true) : setRegisterFormOpen(true)
          }
        >
          <IconRender type={"log" + (user ? "out" : "in")} size={12} /> Log
          {user ? "out" : "in"}
        </button>
      </div>
      <Confirm
        header="Logout"
        isOpen={logoutOpen}
        setIsOpen={() => setLogoutOpen(false)}
        focus="cancel"
        onConfirm={() => {
          logout();
          setUser(null);
        }}
      >
        Are you sure you want to log out?
      </Confirm>
      <RegistrationModalForm
        header="Login or Register"
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSuccess={() => {
          setRegisterFormOpen(false);
          setUser();
          setLoading(false);
        }}
      />
    </IconContext.Provider>
  );
};

export default Navbar;
