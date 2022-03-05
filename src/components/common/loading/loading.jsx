import React from "react";
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
    borderRadius: 10,
    zIndex: 999,
  },
};

const Loading = ({ loading, showText }) => {
  return (
    <Modal
      isOpen={loading}
      style={style}
      closeOnDocumentClick={false}
      ariaHideApp={false}
    >
      <IconContext.Provider value={{ className: "loading-icon" }}>
        <div className="text-center">
          <h1 className="light-text">dosshouse</h1>
          <HomeIcon size="40px" />
          <br />
          <br />
          <LoadingAnimation />
          <br />
          {showText && (
            <>
              <p className="light-text">
                Our APIs run on free plans from{" "}
                <a href="https://render.com" target="_blank" rel="noreferrer">
                  render.com
                </a>
                .<br />
                They may take a minute or two to wake up.
              </p>
              <p className="light-text">Don't want to wait?</p>
              <button
                className="btn btn-sm btn-light"
                onClick={() => window.location.reload()}
              >
                Reload the Page
              </button>
            </>
          )}
        </div>
      </IconContext.Provider>
    </Modal>
  );
};

export default Loading;
