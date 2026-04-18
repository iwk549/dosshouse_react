import { tipLink } from "../../utils/links";

const TipJarContent = ({ onTip }) => (
  <>
    <p style={{ margin: "10px 0" }}>
      Enjoying the app? A small tip helps keep it running and supports future
      features.
    </p>
    <a
      href={tipLink}
      target="_blank"
      rel="noreferrer"
      className="btn btn-sm btn-dark"
      onClick={onTip}
    >
      Leave a Tip
    </a>
  </>
);

export default TipJarContent;
