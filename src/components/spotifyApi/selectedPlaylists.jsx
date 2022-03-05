import React, { useState, useEffect, useContext, useRef } from "react";

const SelectedPlaylists = ({ selectedPlaylists, onRemovePlaylist }) => {
  if (selectedPlaylists.length === 0)
    return (
      <div className="side-by-side right">
        <h4>Add a Playlist</h4>
      </div>
    );

  return (
    <div className="side-by-side right">
      <h4>Selected Playlists</h4>
      {selectedPlaylists.length > 0 && (
        <React.Fragment>
          {selectedPlaylists.map((p) => (
            <ul key={p.id}>
              <b>
                <a
                  href={`https://open.spotify.com/playlist/${p.id}`}
                  target="blank_"
                  rel="noopener noreferrer"
                >
                  {p.name}
                </a>
              </b>
              <li>Tracks: {p.tracks === 100 ? "100+" : p.tracks}</li>
              <li>Followers: {p.followers.toLocaleString()}</li>
              <li>Owner: {p.owner}</li>
              <li>Owner userID: {p.owner_id}</li>
              <button
                className="btn btn-sm btn-dark"
                onClick={() => onRemovePlaylist(p.id)}
              >
                Remove Playlist
              </button>
            </ul>
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default SelectedPlaylists;
