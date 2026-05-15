import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IconContext } from "react-icons";
import IconRender from "../common/icons/iconRender";
import LoadingContext from "../../context/loadingContext";
import RegistrationModalForm from "../user/registrationModalForm";
import LogoRender from "../common/image/logoRender";
import NavDropDown from "./navDropDown";
import { logout } from "../../services/userService";
import { toast } from "react-toastify";
import Confirm from "../common/modal/confirm";

const Navbar = () => {
  let navigate = useNavigate();
  const { user, setUser, setLoading } = useContext(LoadingContext);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const links = [
    { to: "/competitions", icon: "prediction", label: "Competitions" },
    { to: "/submissions", icon: "submission", label: "Submissions" },
    ...(user ? [{ to: "/profile", icon: "profile", label: "Account" }] : []),
    ...(user?.role === "admin"
      ? [{ to: "/admin", icon: "settings", label: "Admin" }]
      : []),
    {
      to: "https://blog.picker.ultimatescoreboard.com",
      iconImage: "/assets/usb_b_logo.png",
      label: "Blog",
      external: true,
    },
    {
      to: "https://ultimatescoreboard.com",
      iconImage: "/assets/usb_u_logo.png",
      label: "Ultimate Scoreboard",
      external: true,
    },
  ];

  const handleLogout = () => {
    setLoading(true);
    logout();
    setUser();
    toast.info("Logged out");
    window.location = "home";
    setLoading(false);
  };

  return (
    <IconContext.Provider value={{ className: "nav-icon" }}>
      <nav className="main-nav">
        <div className="nav-left">
          <NavDropDown links={links} />
        </div>
        <div className="nav-center">
          <LogoRender
            className="clickable"
            width={36}
            height={36}
            borderRadius={8}
            onClick={() => navigate("/")}
          />
          <a
            className="nav-tagline"
            href="https://ultimatescoreboard.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            by Ultimate Scoreboard
          </a>
        </div>
        <div className="nav-right">
          {!user ? (
            <button
              className="btn btn-sm btn-dark"
              onClick={() => setRegisterFormOpen(true)}
            >
              <IconRender type="login" size={12} /> Login
            </button>
          ) : (
            <>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setLogoutOpen(true)}
                title="logout"
              >
                <IconRender type="logout" size={12} /> Logout
              </button>
              <Confirm
                header="Logout"
                isOpen={logoutOpen}
                setIsOpen={() => setLogoutOpen(false)}
                focus="cancel"
                onConfirm={handleLogout}
                buttonText={["No", "Yes"]}
              >
                Are you sure you want to log out?
              </Confirm>
            </>
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
