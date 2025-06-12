import React, { useState, useEffect, useContext } from "react";

import cookies from "../../../services/cookieService";
import IconRender from "../icons/iconRender";
import LoadingContext from "../../../context/loadingContext";

const Banner = ({
  announcement,
  onClick,
  buttonText = "Get Started",
  cookieName,
  showIfLoggedIn,
  hide,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { user } = useContext(LoadingContext);

  if (hide) return null;

  const checkForCookie = () => {
    const dismissed = cookies.getCookie(cookieName);
    if (dismissed) setIsDismissed(true);
    else if (!showIfLoggedIn && user) setIsDismissed(true);
  };

  useEffect(() => {
    checkForCookie();
  }, [user]);

  if (isDismissed) return null;

  const handleDismiss = () => {
    cookies.addCookie(cookieName, "dismissed");
    checkForCookie();
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
