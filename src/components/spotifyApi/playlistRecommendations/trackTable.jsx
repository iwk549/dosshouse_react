import React, { Component } from "react";
import Table from "../../common/table/table";

class TrackTable extends Component {
  render() {
    const { tracks, sortColumn, onSort, columns } = this.props;
    return (
      <Table
        data={tracks}
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
        keyProperty={"id"}
        tableClass="custom-table"
      />
    );
  }
}

export default TrackTable;
