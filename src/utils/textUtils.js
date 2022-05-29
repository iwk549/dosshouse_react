import React from "react";

import { longDate } from "./allowables";

export function renderInfoLine(label, value, type, key) {
  const formattedValue = type == "date" ? longDate(value, true) : value;
  return (
    <div key={key}>
      <p>
        {label}: <b>{formattedValue}</b>
      </p>
    </div>
  );
}
