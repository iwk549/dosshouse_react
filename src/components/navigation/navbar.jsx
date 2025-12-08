import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IconContext } from "react-icons";
import IconRender from "../common/icons/iconRender";
import LoadingContext from "../../context/loadingContext";
import RegistrationModalForm from "../user/registrationModalForm";
import LogoRender from "../common/image/logoRender";
import NavDropDown from "./navDropDown";
import SideBySideView from "../common/pageSections/sideBySideView";

const Navbar = () => {
  let navigate = useNavigate();
  const { user, setUser, setLoading } = useContext(LoadingContext);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);

  const links = [
    // { to: "/home", icon: "home", label: "Home" },
    { to: "/competitions", icon: "prediction", label: "Competitions" },
    { to: "/submissions", icon: "submission", label: "Submissions" },
    { to: "/blog", icon: "blog", label: "Blog", external: true },
    // { to: "/spotify_api", icon: "spotify", label: "Spotify API" },
    // { to: "/active_sites", icon: "app", label: "Apps & Sites" },
  ];

  return (
    <IconContext.Provider value={{ className: "nav-icon" }}>
      <div className="main-nav">
        <SideBySideView
          Components={[
            <NavDropDown key={1} links={links} />,
            <LogoRender
              key={2}
              className="clickable"
              onClick={() => navigate("/")}
            />,
            <div key={3}>
              <button
                className={"btn btn-sm btn-" + (user ? "info" : "dark")}
                onClick={() =>
                  user ? navigate("/profile") : setRegisterFormOpen(true)
                }
              >
                <IconRender type={user ? "profile" : "login"} size={12} />{" "}
                {user ? "Profile" : "Login"}
              </button>
            </div>,
          ]}
        />
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
