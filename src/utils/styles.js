const borderShadow = "#dd99ff";

const commonModalStyles = {
  backgroundColor: "#f2f2f2",
  // border: `1px solid ${borderShadow}`,
  top: "50%",
  left: "50%",
  right: "auto",
  bottom: "auto",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
  boxShadow: `2px 2px ${borderShadow}`,
};

export const modalStyle = {
  content: {
    minHeight: "auto",
    maxHeight: "75%",
    width: "75%",
    ...commonModalStyles,
  },
};

export const confirmModalStyle = {
  height: "auto",
  minHeight: "auto",
  maxHeight: "50%",
  width: "25%",
  ...commonModalStyles,
};
