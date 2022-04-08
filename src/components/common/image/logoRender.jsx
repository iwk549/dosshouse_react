import React, { useState, useEffect, useContext, useRef } from "react";

const LogoRender = ({ width = 50, height = 50, borderRadius = 10 }) => {
  return (
    <img
      src="/assets/logo4.png"
      height={height}
      width={width}
      alt="Dosshouse"
      style={{ borderRadius }}
    />
  );
};

export default LogoRender;
