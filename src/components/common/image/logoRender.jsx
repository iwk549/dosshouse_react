import React from "react";

const LogoRender = ({
  width = 50,
  height = 50,
  borderRadius = 10,
  className,
  onClick,
}) => {
  return (
    <img
      src="/assets/logo4.png"
      height={height}
      width={width}
      alt="Dosshouse"
      style={{ borderRadius }}
      className={className}
      onClick={onClick}
    />
  );
};

export default LogoRender;
