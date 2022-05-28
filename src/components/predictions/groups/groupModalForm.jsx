import React, { Component } from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import TabbedArea from "react-tabbed-area";

import BasicModal from "../../common/modal/basicModal";
import LoadingContext from "../../../context/loadingContext";
import { titleCase } from "../../../utils/allowables";
import descriptionText from "../../../textMaps/groups";
import { deleteGroup, saveGroup } from "../../../services/groupsService";
import { addPredictionToGroup } from "../../../services/predictionsService";
import MyGroupsList from "./myGroupsList";
import { getGroups } from "../../../services/groupsService";
import GroupEditForm from "./groupEditForm";

class GroupModalForm extends Component {
  static contextType = LoadingContext;
  state = {
    data: {
      name: "",
      passcode: "",
    },
    errors: {},
    selectedTab: "Join",
    groups: [],
  };

  async componentDidMount() {
    this.context.setLoading(true);
    const res = await getGroups();
    if (res.status === 200) this.setState({ groups: res.data });
    else toast.error(res.data);
    this.context.setLoading(false);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) this.componentDidMount();
  }

  schema = {
    name: Joi.string().allow("").min(1).max(50).label("Name"),
    passcode: Joi.string().required().min(8).max(100).label("Passcode"),
  };
  tabs = ["Join", "Create", "Manage"];

  setSelectedTab = (selectedTab) => {
    this.setState({ selectedTab });
  };

  handleCreateAndJoin = async (data) => {
    this.context.setLoading(true);
    let error = false;
    const type = this.state.selectedTab.toLowerCase();
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

  handleDeleteGroup = async (group) => {
    this.context.setLoading(true);
    const res = await deleteGroup(group._id);
    if (res.status === 200) {
      toast.success("Group Deleted");
      this.props.onSuccess();
      return this.componentDidMount();
    } else toast.error(res.data);
    this.context.setLoading(false);
  };

  handleEditGroup = async (data, group) => {
    this.context.setLoading(true);
    const res = await saveGroup(group._id, data);
    if (res.status === 200) {
      toast.success("Group Updated");
      this.props.onSuccess();
      return this.componentDidMount();
    } else toast.error(res.data);
    this.context.setLoading(false);
  };

  isTab = (tab) => {
    return this.state.selectedTab.toLowerCase().includes(tab.toLowerCase());
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
            {this.isTab("manage") && this.state.groups.length === 0 ? (
              <p>You have not created any groups yet</p>
            ) : (
              descriptionText[this.state.selectedTab]
            )}
            {this.isTab("manage") ? (
              <>
                <MyGroupsList
                  groups={this.state.groups}
                  onEditGroup={this.handleEditGroup}
                  onDeleteGroup={this.handleDeleteGroup}
                />
              </>
            ) : (
              <GroupEditForm
                onSubmit={this.handleCreateAndJoin}
                buttonText={
                  this.state.selectedTab === "edit"
                    ? "Save"
                    : titleCase(this.state.selectedTab)
                }
              />
            )}
          </div>
        </TabbedArea>
      </BasicModal>
    );
  }
}

export default GroupModalForm;
