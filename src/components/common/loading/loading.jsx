import React, { useState, useEffect, useContext, useRef } from "react";
import Modal from "react-modal";
import { IconContext } from "react-icons";
import HomeIcon from "../icons/homeIcon";
import LoadingAnimation from "./loadingAnimation";

const style = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "auto",
    width: "auto",
    backgroundColor: "#000",
    border: `1px solid #831fe0`,
    zIndex: 999,
  },
};

const Loading = ({ loading }) => {
  return (
    <Modal
      isOpen={loading}
      style={style}
      closeOnDocumentClick={false}
      ariaHideApp={false}
    >
      <IconContext.Provider value={{ className: "loading-icon" }}>
        <div className="text-center">
          <h3 className="light-text">DossHouse</h3>
          <HomeIcon size="40px" />
          <br />
          <br />
          <LoadingAnimation />
        </div>
      </IconContext.Provider>
    </Modal>
  );
};

export default Loading;
