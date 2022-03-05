import React, { Component } from "react";
import Table from "../common/table";

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
        headerClass="thead-dark"
        tableClass="table-hover table-sm"
      />
    );
  }
}

export default TrackTableProbs;
