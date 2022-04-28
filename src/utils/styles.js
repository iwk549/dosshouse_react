const commonModalStyles = {
  backgroundColor: "#f2f2f2",
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
  height: "auto",
  maxHeight: "50%",
  width: "25%",
  ...commonModalStyles,
};
