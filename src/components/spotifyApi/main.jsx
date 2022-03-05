import React, { Component } from "react";
import { getPlaylistRecommendations } from "../../services/audioFeaturesService";
import TrackTable from "./trackTable";
import _ from "lodash";
import PlaylistForm from "./playlistForm";
import SearchBox from "../common/searchBox";
import { toast } from "react-toastify";
import TrackTableProbs from "./trackTableWithProbs";
import ExcelDownload from "../common/excelDownload";
import ReadMe from "./readMe";
import { round } from "mathjs";
import { getArtistInfo, getPlaylistInfo } from "../../services/nameService";
import ChartSelector from "./chartSelector";
import LoadingContext from "../../context/loadingContext";
import SelectedArtist from "./selectedArtist";
import SelectedPlaylists from "./selectedPlaylists";

class Main extends Component {
  static contextType = LoadingContext;
  state = {
    data: [],
    sortColumn: { path: "trackName", order: "asc" },
    searchQuery: "",
    credentialsOpen: false,
    probability: false,
    all_songs: false,
    readMeOpen: false,
    artistImageURL: "",
    artistName: "",
    artistGenres: "",
    selectedArtist: "",
    selectedPlaylists: [],
    selectedPlaylistIDs: [],
  };

  handleSort = (newSortColumn) => {
    this.setState({ sortColumn: newSortColumn });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedLeague: null, currentPage: 1 });
  };

  getArtistCB = async (id) => {
    this.context.setLoading(true);
    const params = {
      api_id: localStorage.getItem("api_id"),
      api_key: localStorage.getItem("api_key"),
      artistID: id,
    };
    const response = await getArtistInfo(params);
    if (response && response.status === 200) {
      response.data.id = id;
      this.setState({
        selectedArtist: response.data,
      });
    } else if (response) {
      this.setState({ selectedArtist: "" });
      toast("Artist ID is invalid");
    }
    this.context.setLoading(false);
  };

  getPlaylistCB = async (id) => {
    const params = {
      api_id: localStorage.getItem("api_id"),
      api_key: localStorage.getItem("api_key"),
      playlistID: id,
    };
    let selectedPlaylists = [...this.state.selectedPlaylists];
    let selectedPlaylistIDs = [...this.state.selectedPlaylistIDs];
    if (selectedPlaylistIDs.includes(id)) {
      toast("You have already added this playlist.");
      return false;
    }
    this.context.setLoading(true);
    let added = false;
    const response = await getPlaylistInfo(params);
    if (response && response.status === 200) {
      selectedPlaylistIDs.push(id);
      response.data.id = id;
      selectedPlaylists.push(response.data);
      this.setState({ selectedPlaylists, selectedPlaylistIDs });
      added = true;
      this.context.setLoading(false);
    } else if (response) toast(response.data);

    this.context.setLoading(false);
    return added;
  };

  handleRemovePlaylist = (id) => {
    let selectedPlaylists = [...this.state.selectedPlaylists];
    let selectedPlaylistIDs = [...this.state.selectedPlaylistIDs];
    selectedPlaylistIDs = selectedPlaylistIDs.filter((p) => p !== id);
    selectedPlaylists = selectedPlaylists.filter((p) => p.id !== id);
    this.setState({ selectedPlaylistIDs, selectedPlaylists });
  };

  submitCallbackFunction = async (data) => {
    this.context.setLoading(true);
    const params = {
      api_id: localStorage.getItem("api_id"),
      api_key: localStorage.getItem("api_key"),
      playlist_ids: data.playlistIDs.replace(/ /g, ""),
      artist_id: data.artistID,
      probability: data.probability,
      all_songs: data.all_songs,
    };
    const response = await getPlaylistRecommendations(params);
    if (response && response.status === 200) {
      let predictions = JSON.parse(response.data.predictions);
      predictions.forEach((d) => {
        d.album_id = d.album_id[0];
      });
      this.setState({ data: predictions, probability: data.probability });
    } else if (response) toast.error(response.data);
    this.context.setLoading(false);
  };

  modalToggle = () => {
    const readMeOpen = this.state.readMeOpen ? false : true;
    this.setState({ readMeOpen });
  };

  renderExcelDownload(data, columns) {
    return null;
    // return <ExcelDownload data={data} columns={columns} />;
  }

  getPageData = () => {
    const { sortColumn, data, searchQuery } = this.state;
    let filteredTracks = data;
    if (searchQuery)
      filteredTracks = data.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const sortedTracks = _.orderBy(
      filteredTracks,
      [sortColumn.path],
      [sortColumn.order]
    );
    return sortedTracks;
  };

  render() {
    const {
      data,
      sortColumn,
      searchQuery,
      probability,
      readMeOpen,
      selectedArtist,
      selectedPlaylists,
      selectedPlaylistIDs,
    } = this.state;
    const sortedTracks = this.getPageData();
    let dataColumns = [];
    let trackTableColumns = [
      { path: "name", label: "Track Name" },
      { path: "artists", label: "Artists" },
      { path: "album_name", label: "Album Name" },
    ];

    let trackTableProbColumns = [...trackTableColumns];
    if (data) {
      for (let property in data[0]) {
        dataColumns.push(property);
        if (property.toLowerCase() !== property) {
          data.forEach((t) => {
            t[property] = round(t[property], 3);
          });
          trackTableProbColumns.push({ path: property, label: property });
        }
      }
    }

    selectedPlaylistIDs.length > 1
      ? trackTableColumns.push({
          path: "playlist_recommendation",
          label: "Playlist Recommendation",
        })
      : trackTableColumns.push({
          path: "euclidean_distance",
          label: "Match Distance",
        });

    return (
      <div className="container">
        <ReadMe
          id="readMe"
          closeModal={this.modalToggle}
          popupOpen={readMeOpen}
        />
        <div className="row">
          <div className="col">
            <h2>Spotify Playlist Recommendations</h2>
          </div>
          <div className="col-2">
            <button
              className="btn btn-sm btn-info sticky-top"
              onClick={this.modalToggle}
            >
              ReadMe
            </button>
          </div>
        </div>
        <hr />

        <PlaylistForm
          submitCallbackFunction={this.submitCallbackFunction}
          getArtistCB={this.getArtistCB}
          getPlaylistCB={this.getPlaylistCB}
          selectedPlaylistIDs={selectedPlaylistIDs.join(",")}
        />
        <hr />
        <SelectedArtist selectedArtist={selectedArtist} />
        <SelectedPlaylists
          selectedPlaylists={selectedPlaylists}
          onRemovePlaylist={this.handleRemovePlaylist}
        />
        <hr />
        {data.length > 0 &&
          dataColumns.length > 0 &&
          this.renderExcelDownload(data, dataColumns)}
        {data.length > 0 && (
          <React.Fragment>
            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Search by track name..."
            />
            {probability && selectedPlaylistIDs.length > 1 ? (
              <TrackTableProbs
                tracks={sortedTracks}
                sortColumn={sortColumn}
                onSort={this.handleSort}
                columns={trackTableProbColumns}
              />
            ) : (
              <TrackTable
                tracks={sortedTracks}
                sortColumn={sortColumn}
                onSort={this.handleSort}
                columns={trackTableColumns}
              />
            )}
          </React.Fragment>
        )}
        {data.length > 0 && <ChartSelector data={this.state.data} />}
      </div>
    );
  }
}

export default Main;
