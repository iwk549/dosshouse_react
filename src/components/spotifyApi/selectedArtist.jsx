import React from "react";

const SelectedArtist = ({ selectedArtist }) => {
  if (!selectedArtist)
    return (
      <div className="side-by-side left">
        <h4>Select Artist</h4>
      </div>
    );
  return (
    <div className="side-by-side left">
      <h4 className="text-left">
        Artist:{" "}
        <a
          href={`https://open.spotify.com/artist/${selectedArtist.id}`}
          target="blank_"
          rel="noopener noreferrer"
        >
          {selectedArtist.name}
        </a>
      </h4>
      <React.Fragment>
        <div className="row">
          <div className="col-sm-4">
            <b>Followers: </b>
            {selectedArtist.followers.toLocaleString()}
            <br />
            <br />
            <img
              alt="artistImage"
              src={selectedArtist.image}
              style={{ maxWidth: "150px", maxHeight: "150px" }}
            />
          </div>
          <div className="col-sm-4">
            <b>Genres: </b>
            <ul>
              {selectedArtist.genres.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default SelectedArtist;
