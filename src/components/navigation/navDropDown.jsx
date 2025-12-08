import React, { useState } from "react";
import { IconContext } from "react-icons";
import { NavLink } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";

import IconRender from "../common/icons/iconRender";

const NavDropDown = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getActiveLink = ({ isActive }) => {
    return isActive ? "nav-link active" : "nav-link";
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div>
        <IconContext.Provider value={{ className: "nav-options" }}>
          <IconRender type="nav" size={40} onClick={() => setIsOpen(!isOpen)} />
        </IconContext.Provider>
        {isOpen && (
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: -20,
                right: 20,
                border: "1px solid #831fe0",
                zIndex: 99,
              }}
              onClick={() => setIsOpen(false)}
              className="main-nav"
            >
              {links.map((link, idx) => {
                if (link.external)
                  return (
                    <a key={idx} href={link.to} style={{ color: "white" }}>
                      <IconRender type={link.icon} /> {link.label}
                    </a>
                  );
                return (
                  <div key={idx} style={{ textAlign: "center" }}>
                    <NavLink key={idx} to={link.to} className={getActiveLink}>
                      <IconRender type={link.icon} /> {link.label}
                    </NavLink>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default NavDropDown;
