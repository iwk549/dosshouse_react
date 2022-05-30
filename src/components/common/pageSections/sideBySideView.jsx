import React from "react";

import useWindowDimensions from "../../../utils/useWindowDimensions";

const SideBySideView = ({ Components, mobileWidth }) => {
  const { isMobile, width } = useWindowDimensions();
  const ToMap = Components.filter((C) => C);

  return !isMobile || (mobileWidth && width > mobileWidth) ? (
    <div className="row">
      {ToMap.map((Component, idx) => (
        <div key={idx} style={{ gridColumn: idx + 1, margin: 15 }}>
          {Component}
        </div>
      ))}
    </div>
  ) : (
    Components.map((Component, idx) => (
      <React.Fragment key={idx}>{Component}</React.Fragment>
    ))
  );
};

export default SideBySideView;
