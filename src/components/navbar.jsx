import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { IconContext } from "react-icons";
import IconRender from "./common/icons/iconRender";
import LoadingContext from "../context/loadingContext";
import RegistrationModalForm from "./user/registrationModalForm";
import LogoRender from "./common/image/logoRender";
import { toast } from "react-toastify";

const Navbar = () => {
  let navigate = useNavigate();
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
        <LogoRender />
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
          className={"btn btn-sm btn-" + (user ? "info" : "dark")}
          onClick={() =>
            user ? navigate("/profile") : setRegisterFormOpen(true)
          }
        >
          <IconRender type={user ? "profile" : "login"} size={12} />{" "}
          {user ? "Profile" : "Login"}
        </button>
      </div>
      <RegistrationModalForm
        header="Login or Register"
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSuccess={() => {
          setRegisterFormOpen(false);
          setUser();
          setLoading(false);
        }}
        selectedTab="login"
      />
    </IconContext.Provider>
  );
};

export default Navbar;
