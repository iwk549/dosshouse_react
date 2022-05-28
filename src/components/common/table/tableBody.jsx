import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);
    if (column.path === "date" && item.date)
      item.date = item.date.substring(0, 10);
    return _.get(item, column.path);
  };

  createKey = (item, column, keyProperty) => {
    return item[keyProperty] + (column.path || column.key);
  };

  render() {
    const { data, columns, keyProperty } = this.props;

    return (
      <tbody>
        {data.map((item, idx) => (
          <tr
            className={
              "table-row" +
              (idx % 2 === 1 ? " alternate" : "") +
              (this.props.onSelect ? " clickable" : "")
            }
            key={item[keyProperty]}
          >
            {columns.map((column) => (
              <td
                key={this.createKey(item, column, keyProperty)}
                className="table-cell"
                onClick={
                  this.props.onSelect && !column.nonSelectable
                    ? () => this.props.onSelect(item, idx)
                    : () => {}
                }
              >
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
