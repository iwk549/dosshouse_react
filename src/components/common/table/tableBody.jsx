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

  getBackgroundColor(item, backgroundKey, backgroundStyle) {
    if (backgroundKey === "_id" && item._id === this.props.thisID)
      return backgroundStyle;
    else if (item[backgroundKey] > 0) return backgroundStyle;
  }

  render() {
    const { data, columns, keyProperty, backgroundKey, backgroundStyle } =
      this.props;

    return (
      <tbody>
        {data.map((item, idx) => (
          <tr
            className={"table-row" + (idx % 2 === 1 ? " alternate" : "")}
            key={item[keyProperty]}
          >
            {columns.map((column) => (
              <td
                key={this.createKey(item, column, keyProperty)}
                className="table-cell"
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
