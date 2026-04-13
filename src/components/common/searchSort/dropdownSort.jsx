import React from "react";

import FormSelect from "../form/select";
import { decideSortOrder } from "../../../utils/allowables";
import IconRender from "../icons/iconRender";

const DropdownSort = ({ onSort, columns, sortColumn }) => {
  const options = columns.map((c) => {
    return { label: c.label, value: c.path };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 12px" }}>
      <div style={{ flex: 1 }}>
        <FormSelect
          options={options}
          onChange={(option) => onSort(decideSortOrder(sortColumn, option))}
          selectedOption={sortColumn.path}
        />
      </div>
      <button
        type="button"
        className="btn btn-dark btn-sm"
        onClick={() => onSort(decideSortOrder(sortColumn, sortColumn.path))}
      >
        <IconRender type={sortColumn.order === "asc" ? "up" : "down"} />
      </button>
    </div>
  );
};

export default DropdownSort;
