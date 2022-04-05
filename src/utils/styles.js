const commonModalStyles = {
  backgroundColor: "#e6e6e6",
  border: "1px solid #831fe0",
  top: "50%",
  left: "50%",
  right: "auto",
  bottom: "auto",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
};

export const modalStyle = {
  content: {
    height: "50%",
    width: "50%",
    ...commonModalStyles,
  },
};

export const confirmModalStyle = {
  content: {
    maxHeight: "25%",
    width: "25%",
    ...commonModalStyles,
  },
};
