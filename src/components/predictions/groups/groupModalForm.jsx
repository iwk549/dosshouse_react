import { Component } from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import SegmentedControl from "../../common/pageSections/segmentedControl";

import BasicModal from "../../common/modal/basicModal";
import LoadingContext from "../../../context/loadingContext";
import { titleCase } from "../../../utils/allowables";
import descriptionText from "../../../textMaps/groups";
import {
  deleteGroup,
  saveGroup,
  getGroups,
} from "../../../services/groupsService";
import { addPredictionToGroup } from "../../../services/predictionsService";
import MyGroupsList from "./myGroupsList";
import GroupEditForm from "./groupEditForm";

class GroupModalForm extends Component {
  static contextType = LoadingContext;
  state = {
    data: {
      name: "",
      passcode: "",
    },
    errors: {},
    selectedTab: "Create",
    groups: [],
  };

  async loadData() {
    this.context.setLoading(true);
    const res = await getGroups();
    if (res?.status === 200) this.setState({ groups: res.data });
    else toast.error(res?.data || "Could not load groups");
    this.context.setLoading(false);
  }

  componentDidMount() {
    this.loadData();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen)
      this.loadData();
  }

  schema = {
    name: Joi.string().allow("").min(1).max(50).label("Name"),
    passcode: Joi.string().required().min(8).max(100).label("Passcode"),
  };

  setSelectedTab = (selectedTab) => {
    this.setState({ selectedTab });
  };

  handleCreateGroup = async (data) => {
    this.context.setLoading(true);
    const res = await saveGroup(null, data);
    if (res.status === 200) {
      toast.success("Group Created");
      this.props.onSuccess?.();
      this.setState({ selectedTab: "Manage" });
      return this.loadData();
    } else toast.error(res.data);
    this.context.setLoading(false);
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
        data,
      );
      if (addRes.status === 200) toast.success("Submission added to group");
      else {
        toast.error(addRes.data);
        error = true;
      }
    }
    if (!error) this.props.onSuccess?.();

    this.context.setLoading(false);
  };

  handleDeleteGroup = async (group) => {
    this.context.setLoading(true);
    const res = await deleteGroup(group._id);
    if (res.status === 200) {
      toast.success("Group Deleted");
      this.props.onSuccess?.();
      return this.loadData();
    } else toast.error(res.data);
    this.context.setLoading(false);
  };

  handleEditGroup = async (data, group) => {
    this.context.setLoading(true);
    const res = await saveGroup(group._id, data);
    if (res.status === 200) {
      toast.success("Group Updated");
      this.props.onSuccess?.();
      return this.loadData();
    } else toast.error(res.data);
    this.context.setLoading(false);
  };

  isTab = (tab) => {
    return this.state.selectedTab.toLowerCase().includes(tab.toLowerCase());
  };

  render() {
    const tabs = ["Create", "Manage"];
    if (this.props.submission) tabs.unshift("Join");

    return (
      <BasicModal
        isOpen={this.props.isOpen}
        onClose={this.props.setIsOpen}
        header={
          <div className="standout-header">
            Manage Groups
            {this.props.submission ? (
              <div style={{ fontSize: "0.8em", fontWeight: "normal" }}>
                {this.props.submission.name}
              </div>
            ) : null}
            {this.props.submission && (
              <div style={{ fontSize: "0.65em", fontWeight: "normal" }}>
                {this.props.submission.competitionID?.name}
              </div>
            )}
          </div>
        }
      >
        <SegmentedControl
          tabs={tabs}
          selectedTab={this.state.selectedTab}
          onSelectTab={this.setSelectedTab}
        />
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
                competition={this.props.submission?.competitionID}
              />
            </>
          ) : (
            <GroupEditForm
              onSubmit={
                this.props.submission
                  ? this.handleCreateAndJoin
                  : this.handleCreateGroup
              }
              buttonText={
                this.state.selectedTab === "edit"
                  ? "Save"
                  : titleCase(this.state.selectedTab)
              }
            />
          )}
        </div>
      </BasicModal>
    );
  }
}

export default GroupModalForm;
