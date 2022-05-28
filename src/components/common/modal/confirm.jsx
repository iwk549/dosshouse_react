import React from "react";

import BasicModal from "./basicModal";
import { confirmModalStyle } from "../../../utils/styles";
import SideBySideView from "../pageSections/sideBySideView";
import useWindowDimensions from "../../../utils/useWindowDimensions";

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
  const { isMobile } = useWindowDimensions();
  const handleClick = (fn) => {
    setIsOpen(false);
    if (fn) fn();
  };
  return (
    <BasicModal
      header={header && <h4>{header}</h4>}
      isOpen={isOpen}
      onClose={setIsOpen}
      style={!isMobile ? confirmModalStyle : null}
      hideClose={true}
    >
      <div className="text-center">
        {children}
        <br />
        <hr />
        <SideBySideView
          Components={[
            !confirmOnly ? (
              <div className="col">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleClick(onCancel)}
                  autoFocus={focus === "cancel"}
                >
                  {buttonText[0]}
                </button>
              </div>
            ) : null,
            <>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => handleClick(onConfirm)}
                autoFocus={focus === "confirm"}
              >
                {buttonText[1]}
              </button>
            </>,
          ]}
          mobileWidth={200}
        />
      </div>
    </BasicModal>
  );
};

export default Confirm;
