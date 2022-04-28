import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";

import Form from "../../common/form/form";
import BasicModal from "../../common/modal/basicModal";
import TabbedArea from "../../common/pageSections/tabbedArea";
import LoadingContext from "../../../context/loadingContext";
import { titleCase } from "../../../utils/allowables";
import descriptionText from "../../../textMaps/groups";
import { saveGroup } from "../../../services/groupsService";
import { addPredictionToGroup } from "../../../services/predictionsService";

class GroupModalForm extends Form {
  static contextType = LoadingContext;
  state = {
    data: {
      name: "",
      passcode: "",
    },
    errors: {},
    selectedTab: "join",
  };

  schema = {
    name: Joi.string().allow("").min(1).max(50).label("Name"),
    passcode: Joi.string().required().min(8).max(100).label("Passcode"),
  };
  tabs = ["join", "create"];

  setSelectedTab = (selectedTab) => {
    this.setState({ selectedTab });
  };

  doSubmit = async () => {
    this.context.setLoading(true);
    let error = false;
    const type = this.state.selectedTab;
    let data = { ...this.state.data };
    if (type === "create") {
      const res = await saveGroup(null, data);
      if (res.status !== 200) {
        toast.error(res.data);
        error = true;
      }
    }
    if (!error) {
      const addRes = await addPredictionToGroup(
        this.props.submission._id,
        data
      );
      if (addRes.status === 200) toast.success("Submission added to group");
      else {
        toast.error(addRes.data);
        error = true;
      }
    }
    if (!error) this.props.onSuccess();

    this.context.setLoading(false);
  };

  render() {
    return (
      <BasicModal
        isOpen={this.props.isOpen}
        onClose={this.props.setIsOpen}
        header={
          <>
            <h3>
              <b>{`Manage Groups for ${this.props.submission.name}`}</b>
            </h3>
            <h4>{this.props.submission.competitionID?.name}</h4>
          </>
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
              {descriptionText[this.state.selectedTab]}
              {this.renderInput("name", "Name", "autofocus")}
              {this.renderInput("passcode", "Passcode", "", "passcode")}
              {this.renderValidatedButton(
                this.state.selectedTab === "edit"
                  ? "Save"
                  : titleCase(this.state.selectedTab)
              )}
            </form>
          </div>
        </TabbedArea>
      </BasicModal>
    );
  }
}

export default GroupModalForm;
