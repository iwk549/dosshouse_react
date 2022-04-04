import React from "react";
import Modal from "react-modal";

import { modalStyle } from "../../../utils/allowables";

const BasicModal = ({
  id,
  isOpen,
  header,
  onClose,
  alsoRunOnClose,
  children,
  style,
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
      style={{ ...modalStyle, ...style }}
    >
      <div className="text-center">
        <button
          className="btn btn-block btn-md btn-light"
          onClick={() => {
            onClose(id ? id : false);
            if (alsoRunOnClose) alsoRunOnClose();
          }}
        >
          Close
        </button>
        {header}
      </div>
      {children}
    </Modal>
  );
};

export default BasicModal;
