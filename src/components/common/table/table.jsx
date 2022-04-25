import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({
  columns,
  sortColumn,
  onSort,
  data,
  keyProperty,
  tableClass,
  headerClass,
  label,
  backgroundKey,
  backgroundStyle,
  thisID,
  onSelect,
}) => {
  return (
    <div>
      {label && <h5>{label}</h5>}
      <table className={tableClass ? "table " + tableClass : "custom-table"}>
        <TableHeader
          headerClass={headerClass}
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <TableBody
          data={data}
          columns={columns}
          keyProperty={keyProperty}
          backgroundKey={backgroundKey}
          backgroundStyle={backgroundStyle}
          thisID={thisID}
          onSelect={onSelect}
        />
      </table>
    </div>
  );
};

export default Table;
