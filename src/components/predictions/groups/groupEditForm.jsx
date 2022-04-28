import React from "react";
import Form from "../../common/form/form";
import Joi from "joi-browser";

class GroupEditForm extends Form {
  state = {
    data: {
      name: "",
      passcode: "",
    },
    errors: "",
  };

  componentDidMount() {
    this.setState({ data: { name: this.props.groupName || "", passcode: "" } });
  }

  schema = {
    name: Joi.string().allow("").min(1).max(50).label("Name"),
    passcode: Joi.string().required().min(8).max(100).label("Passcode"),
  };

  doSubmit = () => {
    this.props.onSubmit(this.state.data);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderInput("name", "Name", "autofocus")}
        {this.renderInput("passcode", "Passcode", "", "passcode")}
        {this.renderValidatedButton(this.props.buttonText)}
      </form>
    );
  }
}

export default GroupEditForm;
