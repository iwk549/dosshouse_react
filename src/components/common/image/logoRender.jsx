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
      src="/assets/usb_p_logo.png"
      height={height}
      width={width}
      alt="Ultimate Scoreboard Picker"
      style={{ borderRadius }}
      className={className}
      onClick={onClick}
    />
  );
};

export default LogoRender;
