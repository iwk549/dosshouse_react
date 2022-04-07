import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import Form from "../common/form/form";
import BasicModal from "../common/modal/basicModal";
import { registerUser, loginUser } from "../../services/userService";
import TabbedArea from "../common/pageSections/tabbedArea";
import LoadingContext from "../../context/loadingContext";
import { titleCase } from "../../utils/allowables";

class RegistrationModalForm extends Form {
  static contextType = LoadingContext;
  state = {
    data: {
      name: "",
      email: "",
      password: "",
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

  doSubmit = async () => {
    this.context.setLoading(true);
    let res;
    const type = this.state.selectedTab;
    if (type === "register") res = await registerUser(this.state.data);
    else if (type === "login") res = await loginUser(this.state.data);
    if (res.status === 200) {
      this.context.setUser();
      toast.success(
        type === "register" ? "Registration Successful" : "Logged In"
      );
      return this.props.onSuccess();
    } else toast.error(res.data);
    this.context.setLoading(false);
  };

  render() {
    return (
      <BasicModal
        isOpen={this.props.isOpen}
        onClose={this.props.setIsOpen}
        header={
          this.props.header ? (
            <h4 className="text-center">{this.props.header}</h4>
          ) : (
            <br />
          )
        }
      >
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
