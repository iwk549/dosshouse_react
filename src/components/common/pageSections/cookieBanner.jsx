import React, { useEffect, useState } from "react";

import BasicModal from "../modal/basicModal";
import cookies from "../../../services/cookieService";

const CookieBanner = ({ rejectionCallback, acceptanceCallback, inModal }) => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const accepted = cookies.getCookie(cookies.acceptedName);
    if (accepted) setCookiesAccepted(true);
  }, []);

  const handleAccept = () => {
    setModalOpen(false);
    cookies.addCookie(cookies.acceptedName, true);
    setCookiesAccepted(true);
    if (acceptanceCallback) acceptanceCallback();
  };

  const handleReject = () => {
    setCookiesAccepted(true);
    if (rejectionCallback) rejectionCallback();
  };

  if (cookiesAccepted) return null;

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
    >
      <b>Please accept cookies</b>
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
            <b>User Token</b>: For retrieving and storing your information in
            our database
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
