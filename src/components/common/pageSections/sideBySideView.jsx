import React, { useState, useEffect, useContext, useRef } from "react";

import useWindowDimensions from "../../../utils/useWindowDimensions";

const SideBySideView = ({ Components, mobileWidth }) => {
  const { isMobile, width } = useWindowDimensions();
  const ToMap = Components.filter((C) => C);

  return !isMobile || (mobileWidth && width > mobileWidth) ? (
    <div className="row">
      {ToMap.map((Component, idx) => (
        <div key={idx} style={{ gridColumn: idx + 1 }}>
          {Component}
        </div>
      ))}
    </div>
  ) : (
    Components.map((Component) => Component)
  );
};

export default SideBySideView;
