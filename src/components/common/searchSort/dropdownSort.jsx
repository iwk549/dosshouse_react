import React from "react";

import FormSelect from "../form/select";
import { decideSortOrder } from "../../../utils/allowables";
import IconRender from "../icons/iconRender";

const DropdownSort = ({ onSort, columns, sortColumn }) => {
  const options = columns.map((c) => {
    return { label: c.label, value: c.path };
  });

  return (
    <div style={{ position: "relative" }}>
      <div style={{ width: "90%" }}>
        <FormSelect
          options={options}
          onChange={(option) => onSort(decideSortOrder(sortColumn, option))}
          // label=""
          selectedOption={sortColumn.path}
        />
      </div>
      <div
        style={{ position: "absolute", right: 0, top: "30%" }}
        className="clickable"
        onClick={() => onSort(decideSortOrder(sortColumn, sortColumn.path))}
      >
        <IconRender type={sortColumn.order === "asc" ? "up" : "down"} />
      </div>
    </div>
  );
};

export default DropdownSort;
