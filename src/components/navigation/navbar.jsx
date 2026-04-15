import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IconContext } from "react-icons";
import IconRender from "../common/icons/iconRender";
import LoadingContext from "../../context/loadingContext";
import RegistrationModalForm from "../user/registrationModalForm";
import LogoRender from "../common/image/logoRender";
import NavDropDown from "./navDropDown";

const Navbar = () => {
  let navigate = useNavigate();
  const { user, setUser, setLoading } = useContext(LoadingContext);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);

  const links = [
    // { to: "/home", icon: "home", label: "Home" },
    ...(user ? [{ to: "/profile", icon: "profile", label: "Profile" }] : []),
    { to: "/competitions", icon: "prediction", label: "Competitions" },
    { to: "/submissions", icon: "submission", label: "Submissions" },
    {
      to: "https://blog.picker.ultimatescoreboard.com",
      icon: "blog",
      label: "Blog",
      external: true,
    },
    // { to: "/spotify_api", icon: "spotify", label: "Spotify API" },
    // { to: "/active_sites", icon: "app", label: "Apps & Sites" },
  ];

  return (
    <IconContext.Provider value={{ className: "nav-icon" }}>
      <nav className="main-nav">
        <div className="nav-left">
          <NavDropDown links={links} />
        </div>
        <div className="nav-center">
          <LogoRender
            className="clickable"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="nav-right">
          {!user && (
            <button
              className="btn btn-sm btn-dark"
              onClick={() => setRegisterFormOpen(true)}
            >
              <IconRender type="login" size={12} /> Login
            </button>
          )}
        </div>
      </nav>
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
