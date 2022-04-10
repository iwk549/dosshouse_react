import React from "react";
import Joi from "joi-browser";

import Form from "../common/form/form";
import { MdOutlineEditRoad } from "react-icons/md";

class UserInfoForm extends Form {
  state = {
    data: { name: "" },
    errors: {},
  };

  componentDidMount() {
    this.setState({
      data: {
        name: this.props.user.name,
      },
    });
  }

  schema = {
    name: Joi.string().required().label("Name"),
  };

  doSubmit = () => {
    this.props.onEdit(this.state.data);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <br />
        {this.renderInput("name", "Name", true)}
        {this.renderValidatedButton("Save")}
        <br />
        <br />
      </form>
    );
  }
}

export default UserInfoForm;
