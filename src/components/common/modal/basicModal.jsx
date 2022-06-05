import React from "react";
import Modal from "react-modal";

import { modalStyle } from "../../../utils/styles";
import useWindowDimensions from "../../../utils/useWindowDimensions";

const BasicModal = ({
  id,
  isOpen,
  header,
  onClose,
  alsoRunOnClose,
  children,
  style,
  hideClose,
}) => {
  const { isMobile } = useWindowDimensions();
  return (
    <Modal
      id={id}
      isOpen={isOpen}
      closeOnDocumentClick
      onRequestClose={() => {
        onClose(id ? id : false);
        if (alsoRunOnClose) alsoRunOnClose();
      }}
      ariaHideApp={false}
      style={{
        content: { ...modalStyle.content, ...(!isMobile ? style : {}) },
      }}
    >
      <div className="text-center">
        {!hideClose && (
          <button
            className="btn btn-block btn-sm btn-light"
            onClick={() => {
              onClose(id ? id : false);
              if (alsoRunOnClose) alsoRunOnClose();
            }}
            style={
              {
                // position: "sticky",
                // top: 0,
                // zIndex: 99,
              }
            }
          >
            Close
          </button>
        )}
        {header}
        {children}
      </div>
    </Modal>
  );
};

export default BasicModal;
