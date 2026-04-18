import React from "react";
import Modal from "react-modal";

import { modalStyle } from "../../../utils/styles";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import IconRender from "../icons/iconRender";

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
      <div style={{ position: "relative" }}>
        {!hideClose && (
          <button
            className="modal-close-btn"
            onClick={() => {
              onClose(id ? id : false);
              if (alsoRunOnClose) alsoRunOnClose();
            }}
            aria-label="Close"
          >
            <IconRender type="close" size={24} />
          </button>
        )}
        <div className="text-center">
          {header}
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default BasicModal;
