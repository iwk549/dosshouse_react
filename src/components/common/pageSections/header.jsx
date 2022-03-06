import React, { useState, useEffect, useContext, useRef } from "react";

const Header = ({ text, secondary }) => {
  return secondary ? <h3>{text}</h3> : <h2>{text}</h2>;
};

export default Header;
