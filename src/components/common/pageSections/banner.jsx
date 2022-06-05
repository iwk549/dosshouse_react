import React, { useState, useEffect } from "react";

import cookies from "../../../services/cookieService";
import IconRender from "../icons/iconRender";

const Banner = ({
  announcement,
  onClick,
  buttonText = "Get Started",
  cookieName,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = cookies.getCookie(cookieName);
    if (dismissed === "dismissed") setIsDismissed(true);
  }, []);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    cookies.addCookie(cookieName, "dismissed");
  };

  const raiseClick = () => {
    handleDismiss();
    onClick();
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{ position: "absolute", right: 10, top: 10 }}
        onClick={handleDismiss}
        className="clickable"
      >
        <IconRender type="close" size={20} />
      </div>
      <div className="single-card announcement">
        <h2>{announcement}</h2>
        <button className="btn btn-md btn-dark" onClick={raiseClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
