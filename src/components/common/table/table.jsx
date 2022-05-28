import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import DropdownSort from "../searchSort/dropdownSort";

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
  CardComponent,
  cardSearchColumns,
}) => {
  // return a card view if on mobile
  const { isMobile } = useWindowDimensions();

  return isMobile && CardComponent ? (
    <>
      <DropdownSort
        onSort={onSort}
        columns={cardSearchColumns || columns}
        sortColumn={sortColumn}
      />
      <CardComponent data={data} onSelect={onSelect} />
    </>
  ) : (
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
