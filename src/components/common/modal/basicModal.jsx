import React from "react";
import Modal from "react-modal";

const BasicModal = ({
  id,
  isOpen,
  header,
  onClose,
  alsoRunOnClose,
  children,
  style,
  noSticky,
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
      style={style}
    >
      <div className={!noSticky ? "sticky-top" : ""}>
        <button
          className="btn btn-block btn-md btn-primary"
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
