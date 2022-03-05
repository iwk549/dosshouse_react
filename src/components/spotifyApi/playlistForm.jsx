import React from "react";
import Form from "../common/form/form";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import LoadingContext from "../../context/loadingContext";
import { toastOptions } from "../../utils/allowables";
import PlaylistInput from "./playlistInput";

class PlaylistForm extends Form {
  static contextType = LoadingContext;
  state = {
    data: {
      playlistIDs: "",
      artistID: "",
      probability: false,
      all_songs: false,
    },
    errors: {},
    apiError: null,
  };

  schema = {
    playlistIDs: Joi.string().required().label("Playlist IDs").min(1),
    artistID: Joi.string()
      .required()
      .min(22)
      .max(22)
      .label("Artist ID")
      .allow(""),
    probability: Joi.boolean().required().label("Include Probabilities"),
    all_songs: Joi.boolean().required().label("Include All Songs"),
  };

  doSubmit = () => {
    let data = { ...this.state.data };
    data.playlistIDs = this.props.selectedPlaylistIDs;
    this.props.submitCallbackFunction(data);
  };

  getArtistCB = (id) => {
    this.props.getArtistCB(id);
  };

  handleAddPlaylist = async (data) => {
    this.context.setLoading(true);
    let { playlistID } = data;
    let added = false;
    if (playlistID.length === 22) {
      added = await this.props.getPlaylistCB(playlistID);
      let data = { ...this.state.data };
      data.playlistIDs = this.props.selectedPlaylistIDs;
      this.setState({ data });
    } else
      toast("Playlist ids should be 22 characters in length.", toastOptions);
    this.context.setLoading(false);
    return added;
  };

  handleCheck = (event) => {
    const data = { ...this.state.data };
    data[event.target.id] = data[event.target.id] ? false : true;
    this.setState({ data });
  };

  render() {
    return (
      <div>
        <PlaylistInput onAddPlaylist={this.handleAddPlaylist} />
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("artistID", "Artist ID:")}
          {/* {this.renderCheckbox("probability", "Include Match Probabilities")} */}
          {this.renderCheckbox("all_songs", "Include All Songs by Artist")}
          {this.renderValidatedButton("Get Recommendations")}
        </form>
      </div>
    );
  }
}

export default PlaylistForm;
