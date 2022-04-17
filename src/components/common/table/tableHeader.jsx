import React, { Component } from "react";

import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

class TableHeader extends Component {
  raiseSort = (path) => {
    const sortColumn = { ...this.props.sortColumn };
    if (sortColumn.path === path)
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    else {
      sortColumn.path = path;
      sortColumn.order = path.toLowerCase().includes("points") ? "desc" : "asc";
    }
    this.props.onSort(sortColumn);
  };

  renderSortIcon = (column) => {
    const { sortColumn } = this.props;
    if (sortColumn) {
      if (column.path !== sortColumn.path) return null;
      if (sortColumn.order === "asc") return <BsCaretUpFill />;
      return <BsCaretDownFill />;
    }
  };

  render() {
    if (this.props.sortColumn) {
      return (
        <thead className={this.props.headerClass || "table-header"}>
          <tr>
            {this.props.columns.map((column) => (
              <th
                key={column.path || column.key}
                className="clickable table-header-cell"
                onClick={() => this.raiseSort(column.path)}
              >
                {column.label} {this.renderSortIcon(column)}
              </th>
            ))}
          </tr>
        </thead>
      );
    } else {
      return (
        <thead className={this.props.headerClass || "table-header"}>
          <tr>
            {this.props.columns.map((column) => (
              <th key={column.path || column.key} className="table-header-cell">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
      );
    }
  }
}

export default TableHeader;
