import React from "react";
import Joi from "joi-browser";

import Form from "../common/form/form";

class PlaylistInput extends Form {
  state = {
    data: {
      playlistID: "",
    },
    errors: {},
  };

  schema = {
    playlistID: Joi.string().required().min(22).max(22).allow(""),
  };

  doSubmit = async () => {
    await this.props.onAddPlaylist(this.state.data);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderInput("playlistID", "Playlist ID:")}
        {this.renderValidatedButton("Add Playlist")}
        <br />
        <br />
      </form>
    );
  }
}

export default PlaylistInput;
