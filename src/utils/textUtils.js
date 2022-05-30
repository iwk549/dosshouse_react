import React from "react";

import { longDate } from "./allowables";

export function renderInfoLine(label, value, type, key, isMobile) {
  const formattedValue = type == "date" ? longDate(value, true) : value;
  return (
    <div key={key}>
      <p>
        {label}
        {isMobile ? <br /> : ": "}
        <b>{formattedValue}</b>
      </p>
    </div>
  );
}
