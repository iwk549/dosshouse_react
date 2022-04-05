import React, { useState, useEffect, useContext, useRef } from "react";

import BasicModal from "./basicModal";
import { confirmModalStyle } from "../../../utils/styles";

const Confirm = ({
  header,
  onConfirm,
  onCancel,
  confirmOnly,
  isOpen,
  setIsOpen,
  children,
  buttonText = ["Cancel", "OK"],
  focus = "confirm",
}) => {
  const handleClick = (fn) => {
    setIsOpen(false);
    if (fn) fn();
  };
  return (
    <BasicModal
      header={header && <h4>{header}</h4>}
      isOpen={isOpen}
      onClose={setIsOpen}
      style={confirmModalStyle}
      hideClose={true}
    >
      <div className="text-center">
        {children}
        <br />
        <hr />
        <div className="row">
          {!confirmOnly && (
            <div className="col">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleClick(onCancel)}
                autoFocus={focus === "cancel"}
              >
                {buttonText[0]}
              </button>
            </div>
          )}
          <div className="col">
            <button
              className="btn btn-dark btn-sm"
              onClick={() => handleClick(onConfirm)}
              autoFocus={focus === "confirm"}
            >
              {buttonText[1]}
            </button>
          </div>
        </div>
      </div>
    </BasicModal>
  );
};

export default Confirm;
