import React from "react";
import Joi from "joi-browser";
import Form from "../common/form/form";
import BasicModal from "../common/modal/basicModal";

import TabbedArea from "../common/pageSections/tabbedArea";

class RegistrationModalForm extends Form {
  state = {
    data: {
      name: "Ian",
      email: "iwk549@gmail.com",
      password: "Password1",
    },
    errors: {},
    selectedTab: this.props.selectedTab || "register",
  };

  schema = {
    name: Joi.string().required().min(1).max(50).label("Name"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(100).label("Password"),
  };
  tabs = ["register", "login"];

  setSelectedTab = (selectedTab) => {
    this.setState({ selectedTab });
  };

  doSubmit = () => {
    this.props.onSubmit(this.state.selectedTab, this.state.data);
  };

  render() {
    return (
      <BasicModal isOpen={this.props.isOpen} onClose={this.props.setIsOpen}>
        {this.props.header ? (
          <h4 className="text-center">{this.props.header}</h4>
        ) : (
          <br />
        )}
        <TabbedArea
          tabs={this.tabs}
          selectedTab={this.state.selectedTab}
          onSelectTab={this.setSelectedTab}
          tabPlacement="top"
        >
          <div className="text-center">
            <h3>
              {this.state.selectedTab === "register"
                ? "Register for a New"
                : "Login to your"}{" "}
              Account
            </h3>
            <form onSubmit={this.handleSubmit}>
              {this.state.selectedTab === "register"
                ? this.renderInput("name", "Name")
                : null}
              {this.renderInput("email", "Email")}
              {this.renderInput("password", "Password", "", "password")}
              {this.renderValidatedButton("Submit")}
            </form>
          </div>
        </TabbedArea>
      </BasicModal>
    );
  }
}

export default RegistrationModalForm;
