import Modal from "react-modal";
import { IconContext } from "react-icons";
import LoadingAnimation from "./loadingAnimation";
import LogoRender from "../image/logoRender";

const style = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "auto",
    width: "auto",
    backgroundColor: "#000",
    border: `1px solid #831fe0`,
    borderRadius: 10,
    zIndex: 999,
  },
  overlay: {
    zIndex: 999,
  },
};

const Loading = ({ loading }) => {
  return (
    <Modal
      isOpen={loading}
      style={style}
      closeOnDocumentClick={false}
      ariaHideApp={false}
    >
      <IconContext.Provider value={{ className: "loading-icon" }}>
        <div className="text-center">
          <h1 className="light-text">dosshouse</h1>
          <LogoRender />
          <br />
          <br />
          <LoadingAnimation />
        </div>
      </IconContext.Provider>
    </Modal>
  );
};

export default Loading;
