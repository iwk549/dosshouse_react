import React from "react";

import ExternalImage from "../components/common/image/externalImage";
import logos from "../textMaps/logos";

export const renderSelectLabel = (text, withLogo) => {
  return (
    <div className="row">
      <div className="col text-right">
        {withLogo && <ExternalImage uri={logos[text]} width={30} height={20} />}
      </div>
      <div className="col text-left">{text}</div>
      <div className="col">
        {withLogo && <ExternalImage uri={logos[text]} width={30} height={20} />}
      </div>
    </div>
  );
};
