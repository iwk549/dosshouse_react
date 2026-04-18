import TipJarContent from "./tipJarContent";
import { dismissTipJarPermanently } from "../../utils/tipJarStorage";

const TipJarBanner = () => (
  <div className="pop-box text-center" style={{ marginTop: 20 }}>
    <h3 style={{ margin: "8px 0" }}>Support the Developer</h3>
    <TipJarContent onTip={dismissTipJarPermanently} />
  </div>
);

export default TipJarBanner;
