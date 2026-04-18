import BasicModal from "../common/modal/basicModal";
import TipJarContent from "./tipJarContent";

const TipJarModal = ({ isOpen, onClose, onDismiss }) => (
  <BasicModal
    isOpen={isOpen}
    onClose={onClose}
    header={<h3>Support the Developer</h3>}
    style={{ maxWidth: 350 }}
  >
    <TipJarContent onTip={onDismiss} />
    <div style={{ marginTop: 16 }}>
      <button className="btn btn-sm btn-light" onClick={onDismiss}>
        Don&apos;t show again
      </button>
    </div>
  </BasicModal>
);

export default TipJarModal;
