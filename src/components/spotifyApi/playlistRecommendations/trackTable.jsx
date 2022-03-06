import React, { Component } from "react";
import Table from "../../common/table";

class TrackTable extends Component {
  columns = [
    { path: "name", label: "Track Name" },
    { path: "artists", label: "Artists" },
    { path: "album_name", label: "Album Name" },
    { path: "spotify_link", label: "Link" },
    { path: "playlist_recommendation", label: "Playlist Recommendation" },
  ];

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
