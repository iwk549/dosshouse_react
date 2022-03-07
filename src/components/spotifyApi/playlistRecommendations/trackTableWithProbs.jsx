import React, { Component } from "react";
import Table from "../../common/table";

class TrackTableProbs extends Component {
  render() {
    const { tracks, sortColumn, onSort } = this.props;
    return (
      <Table
        data={tracks}
        columns={this.props.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        keyProperty={"id"}
        tableClass="custom-table"
      />
    );
  }
}

export default TrackTableProbs;
