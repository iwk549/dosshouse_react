import React, { useState } from "react";
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
      <div className="nav-dropdown-wrapper">
        <button
          className={"nav-hamburger" + (isOpen ? " open" : "")}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Navigation menu"
        >
          <IconRender type="nav" size={22} />
        </button>
        {isOpen && (
          <div className="nav-dropdown" onClick={() => setIsOpen(false)}>
            {links.map((link, idx) => {
              if (link.external)
                return (
                  <a
                    key={idx}
                    href={link.to}
                    className="nav-link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <IconRender type={link.icon} size={16} />
                    <span>{link.label}</span>
                  </a>
                );
              return (
                <NavLink key={idx} to={link.to} className={getActiveLink}>
                  <IconRender type={link.icon} size={16} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default NavDropDown;
