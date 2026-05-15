import React, { useState } from "react";

import Confirm from "../../common/modal/confirm";
import IconRender from "../../common/icons/iconRender";
import GroupEditForm from "./groupEditForm";
import LeaderboardInviteModal from "../leaderboard/leaderboardInviteModal";

const MyGroupsList = ({ groups, onDeleteGroup, onEditGroup, competition }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div>
      {groups.map((g) => {
        const isSelected = g._id === selectedGroup?._id;
        return (
          <React.Fragment key={g._id}>
            <b>{g.name}</b>
            <div className="row">
              <div className="col">
                <button
                  className={
                    "btn btn-" + (editOpen && isSelected ? "light" : "info")
                  }
                  onClick={() => {
                    if (isSelected) {
                      setSelectedGroup(null);
                      setEditOpen(false);
                    } else {
                      setEditOpen(true);
                      setSelectedGroup(g);
                    }
                  }}
                >
                  {editOpen && isSelected ? "Cancel" : "Edit Group Info"}
                </button>
                {editOpen && isSelected && (
                  <GroupEditForm
                    onSubmit={(data) => onEditGroup(data, g)}
                    buttonText="Save"
                    groupName={g.name}
                  />
                )}
              </div>
              {competition && (
                <div className="col">
                  <button
                    className="btn btn-sm btn-dark"
                    onClick={() => setInviteOpen(true)}
                  >
                    Get Invite Link
                  </button>
                  <LeaderboardInviteModal
                    isOpen={inviteOpen}
                    setIsOpen={setInviteOpen}
                    group={g}
                    competition={competition}
                  />
                </div>
              )}
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                setDeleteGroupOpen(true);
                setSelectedGroup(g);
              }}
            >
              <IconRender type="delete" />
            </button>
            <div className="mini-div-line" />
          </React.Fragment>
        );
      })}
      {selectedGroup && (
        <Confirm
          header="Confirm Delete Group"
          isOpen={deleteGroupOpen}
          setIsOpen={() => setDeleteGroupOpen(false)}
          focus="cancel"
          onConfirm={() => onDeleteGroup(selectedGroup)}
        >
          Are you sure you want to delete group {selectedGroup.name}?
          <br />
          <br />
          This cannot be undone.
        </Confirm>
      )}
    </div>
  );
};

export default MyGroupsList;
