import React, { useState, useEffect, useContext, useRef } from "react";

const CLinkSvg = ({
  x,
  y,
  className,
  onMouseOver,
  onMouseOut,
  style,
  disabled,
  clickHandler,
  boldText,
  textColor,
  children,
}) => {
  return (
    <text
      x={x}
      y={y}
      className={`${className} ${disabled ? "" : "svg-link"}`}
      onClick={disabled ? () => {} : clickHandler}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{
        ...style,
        fontWeight: boldText ? "bold" : "regular",
        fill: textColor,
      }}
    >
      {children}
    </text>
  );
};

export default CLinkSvg;
