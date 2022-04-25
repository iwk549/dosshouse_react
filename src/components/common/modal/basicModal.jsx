import React from "react";
import Modal from "react-modal";

import { modalStyle } from "../../../utils/styles";

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
      style={{ content: { ...modalStyle.content, ...style } }}
    >
      <div className="text-center">
        {!hideClose && (
          <button
            className="btn btn-block btn-sm btn-light"
            onClick={() => {
              onClose(id ? id : false);
              if (alsoRunOnClose) alsoRunOnClose();
            }}
          >
            Close
          </button>
        )}
        {header}
      </div>
      {children}
    </Modal>
  );
};

export default BasicModal;
