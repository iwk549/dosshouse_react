import React from "react";
import Joi from "joi-browser";
import Form from "../common/form/form";
import BasicModal from "../common/modal/basicModal";

class RegistrationModalForm extends Form {
  state = {
    data: {
      name: "Ian",
      email: "iwk549@gmail.com",
      password: "Password1",
    },
    errors: {},
  };

  schema = {
    name: Joi.string().required().min(1).max(50).label("Name"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(100).label("Password"),
  };

  doSubmit = () => {
    this.props.onSubmit(this.state.data);
  };

  render() {
    return (
      <BasicModal isOpen={this.props.isOpen} onClose={this.props.setIsOpen}>
        <div>
          <br />
          <h5 className="text-center">
            Register for an account to save your predictions
          </h5>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name")}
            {this.renderInput("email", "Email")}
            {this.renderInput("password", "Password", "", "password")}
            {this.renderValidatedButton("Submit")}
          </form>
          <hr />
          <p>
            An Ultimate Scoreboard league account is not required to participate
            in predictions leaderboards.
            <br />
            If you already have an account but are not currently logged in
            please use your existing email and password here and the predictions
            will be tied to your existing account.
          </p>
        </div>
      </BasicModal>
    );
  }
}

export default RegistrationModalForm;
