import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import Form from "../../common/form/form";
import BasicModal from "../../common/modal/basicModal";
import TabbedArea from "../../common/pageSections/tabbedArea";
import LoadingContext from "../../../context/loadingContext";

class GroupModalForm extends Form {
  static contextType = LoadingContext;
  state = {
    data: {
      name: "",
      passcode: "",
    },
    errors: {},
  };

  schema = {
    name: Joi.string().allow("").min(1).max(50).label("Name"),
    passcode: Joi.string().required().min(8).max(100).label("Passcode"),
  };
  tabs = ["create", "edit", "add"];

  setSelectedTab = (selectedTab) => {
    this.setState({ selectedTab });
  };

  doSubmit = async () => {
    this.context.setLoading(true);
    let res;
    const type = this.state.selectedTab;

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
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("name", "Name", "autofocus")}
              {this.renderInput("passcode", "Passcode", "", "passcode")}
              {this.renderValidatedButton("Submit")}
            </form>
          </div>
        </TabbedArea>
      </BasicModal>
    );
  }
}

export default GroupModalForm;
