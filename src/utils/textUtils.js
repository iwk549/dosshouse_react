import React from "react";

import { shortDate } from "./allowables";

export function renderInfoLine(label, value, type, key) {
  const formattedValue = type == "date" ? shortDate(value) : value;
  return (
    <div key={key}>
      <p>
        {label}: <b>{formattedValue}</b>
      </p>
    </div>
  );
}
