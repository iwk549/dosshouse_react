import React from "react";
import Modal from "react-modal";

const ReadMe = ({ id, popupOpen, closeModal }) => {
  return (
    <Modal
      id={id}
      isOpen={popupOpen}
      closeOnDocumentClick
      onRequestClose={closeModal}
      ariaHideApp={false}
    >
      <div>
        <div style={{ textAlign: "center" }}>
          <button
            className="btn btn-sm btn-info sticky-top"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
        <h3 className="text-center">Purpose</h3>
        <p>
          To determine the best playlist match for each song from the selected
          artist.
        </p>
        <p>
          Click the See Demo button to see the results for The Rolling Stones
          compared to the top pop, country and hip-hop playlists.
        </p>
        <hr />
        <h3 className="text-center">Instructions</h3>
        <ul>
          <li>
            Enter a playlist id and click Add Playlist. The playlist id is a 22
            character string. It can be found at the end of the playlist page
            url.
          </li>
          <li>
            Enter a single artist id. Again this is a 22 character string and
            can be found at the end of the artist&apos;s page.
          </li>
          <li>There are two checkboxes.</li>
          <ul>
            <li>
              Include Match Probabilities will show the probability of match
              that each track has with each playlist.
            </li>
            <li>
              Include All Songs by Artist will run the algorithm for all songs
              by the artist you entered, not just for their top ten songs. For
              artists with very large catalogs this may slow down the results
              considerably.
            </li>
          </ul>
          <li>
            Double check that you have selected the correct artist and
            playlists. You can change the artist by pasting a new artist id in
            the form. To edit which playlists you have click the Remove Playlist
            button below the corresponding playlist.
          </li>
          <li>Click Get Recommendations</li>
          <li>
            If you only selected a single playlist then the output will give
            Match Distance. The lower this number the better match a song is to
            that playlist. If two or more playlists were selected the output
            will display the best matching playlist for each artist song. See
            the Methodology section below for more information.
          </li>
          <li>
            The output table will appear below the form.
            {/* Click Download Full Data to Excel to see all available analysis columns. */}
          </li>
        </ul>
        <hr />
        <h3 className="text-center">Methodology</h3>
        <p>
          The machine learning algorithm is run using a Python Flask RESTapi
          backend deployed to Render. Upon submission the intial data is
          gathered using{" "}
          <a
            target="blank_"
            rel="noopener noreferrer"
            href="https://spotipy.readthedocs.io/en/2.13.0/#"
          >
            Spotipy
          </a>{" "}
          and evaluated with sci-kit learn.
          <br />
          <br />
          The values used for prediction are: danceability, energy, speechiness,
          acousticness, instrumentalness, liveness, and valence. Spotify assigns
          each of these a value between 0 and 1 so no scaling is needed.
          <br />
          <br />
          Cross validation is performed on all of the tracks in the requested
          playlists to determine the best estimator to use for the dataset
          between Known Nearest Neighbors (KNN) and Support Vector
          Classification (SVC). The cross validation is also used to determine
          either the optimal k-value (for KNN) or the optimal kernel, C and
          gamma values (for SVC).
          <br />
          <br />
          Once the optimal estimator and values are determined the estimator is
          fit to the playlist data then the artist tracks are assigned a best
          fitting playlist against the estimator. Note: if{" "}
          <i>Include Match Probabilities</i> is checked then the estimator will
          alway be SVC as KNN does not provide percentages of match.
          <br />
          <br />
          If only a single playlist was selected then the output is the average
          Euclidean Distance between each song in the playlist and each song for
          the selected artist. A lower number here means that the song matches
          better with each of the songs in the playlist (it&apos;s values are
          closer in distance).
        </p>
      </div>
    </Modal>
  );
};

export default ReadMe;
