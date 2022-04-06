import React, { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

const Tooltip = ({ children, content, direction, clickable, size = "sm" }) => {
  const [active, setActive] = useState(false);

  const toggleTip = () => {
    setActive(active ? false : true);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setActive(false)}>
      <div
        className="tooltip-wrapper"
        onMouseEnter={clickable ? null : toggleTip}
        onMouseLeave={clickable ? null : toggleTip}
        onClick={toggleTip}
      >
        {children}
        {active && (
          <div
            className={`tooltip-tip tooltip-${size} ${direction || "bottom"}`}
          >
            {content}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default Tooltip;
