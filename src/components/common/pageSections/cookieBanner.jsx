import React, { useEffect, useState, useContext } from "react";

import BasicModal from "../modal/basicModal";
import cookies from "../../../services/cookieService";
import LoadingContext from "../../../context/loadingContext";

const CookieBanner = ({
  rejectionCallback,
  acceptanceCallback,
  inModal,
  resetOnRejection = false,
  headerText,
}) => {
  const { cookiesAccepted, setCookiesAccepted } = useContext(LoadingContext);
  const [hideThisBanner, setHideThisBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const accepted = cookies.getCookie(cookies.acceptedName);
    if (accepted) {
      handleAccept(false);
    }
  }, []);

  const handleAccept = (addCookie = true) => {
    setModalOpen(false);
    if (addCookie) {
      cookies.addCookie(cookies.acceptedName, true);
      if (acceptanceCallback) acceptanceCallback();
    }
    setCookiesAccepted(true);
    setHideThisBanner(true);
  };

  const handleReject = () => {
    setHideThisBanner(!resetOnRejection);
    if (rejectionCallback) rejectionCallback();
  };

  if (cookiesAccepted || hideThisBanner) return null;

  const renderAcceptButton = () => {
    return (
      <button className="btn btn-block btn-md btn-dark" onClick={handleAccept}>
        Accept
      </button>
    );
  };
  const renderBreak = () => {
    return <div style={{ height: 20 }} />;
  };

  return (
    <div
      style={{
        position: inModal ? "relative" : "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        width: "85%",
        padding: 10,
        textAlign: "center",
      }}
      className="pop-box"
      data-testid="cookie_banner"
    >
      <h3>
        <b>{headerText || "Please accept cookies"}</b>
      </h3>
      {renderAcceptButton()}
      {renderBreak()}
      Dosshouse relies on minimal cookies to maintain your account and
      administer our competitions.
      <button
        className="btn btn-block btn-sm btn-info"
        onClick={() => setModalOpen(true)}
      >
        Cookie Info
      </button>
      {renderBreak()}
      <button className="btn btn-block btn-light" onClick={handleReject}>
        Do Not Accept
      </button>
      <BasicModal
        isOpen={modalOpen}
        onClose={setModalOpen}
        header={<h3>Dosshouse Cookie Info</h3>}
      >
        Cookies stored include:
        <ul>
          <li>
            <b>User Token</b>: To keep you logged in and give you access to our
            competitions
          </li>
          <li>
            <b>Cookies Accepted</b>: Your acceptance of our cookies is stored as
            a cookie
          </li>
          <li>
            <b>Banner Dismissal</b>: So we don&apos;t constantly bother you with
            announcements about our new competitions, we save when you dismiss
            one of our banners.
          </li>
        </ul>
        You are free to use the site without any cookies but will need to accept
        them prior to creating an account.
        {renderBreak()}
        {renderAcceptButton()}
      </BasicModal>
    </div>
  );
};

export default CookieBanner;
