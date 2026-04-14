import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Confirm from "../../common/modal/confirm";
import IconRender from "../../common/icons/iconRender";
import TextLink from "../../common/pageSections/textLink";
import InfoLine from "../../common/pageSections/infoLine";
import { getCurrentUser } from "../../../services/userService";
import StatusNote from "../../common/pageSections/statusNote";

const PredictionGroupList = ({
  prediction,
  setSelectedSubmission,
  setGroupFormOpen,
  onRemoveGroup,
}) => {
  let navigate = useNavigate();
  const [removeGroupOpen, setRemoveGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  if (prediction.isSecondChance) return null;

  const user = getCurrentUser();

  return (
    <div className="groups-panel">
      <div className="groups-panel-header">
        <span className="groups-badge">Groups</span>
      </div>
      <div className="groups-grid">
        {!prediction.groups?.length && (
          <StatusNote>You have not joined any groups</StatusNote>
        )}
        {prediction.groups?.map((g, idx) => {
          const isOwner = user._id === g.ownerID._id;
          return (
            <div key={idx} className="group-item">
              <InfoLine label="Group Name" value={g.name} />
              <InfoLine
                label="Group Owner"
                value={
                  <span title={isOwner ? "You own this group" : ""}>
                    {g.ownerID?.name}
                  </span>
                }
              />
              <div
                className="competition-card-footer"
                style={{ justifyContent: "space-between" }}
              >
                <button
                  title="Remove submission from group"
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setSelectedGroup(g);
                    setRemoveGroupOpen(true);
                  }}
                >
                  <IconRender type="remove" size={15} />
                </button>
                <TextLink
                  onClick={() =>
                    navigate(
                      `/competitions?leaderboard=show&competitionID=${prediction.competitionID?._id}&groupID=${g._id}`,
                    )
                  }
                >
                  View Group Leaderboard
                </TextLink>
              </div>
            </div>
          );
        })}
      </div>
      <button
        key="button"
        className="btn btn-sm btn-dark"
        onClick={() => {
          setSelectedSubmission(prediction);
          setGroupFormOpen(true);
        }}
        data-testid="manage-groups-button"
      >
        Manage Groups
      </button>
      {selectedGroup && (
        <Confirm
          header="Confirm Remove Group"
          isOpen={removeGroupOpen}
          setIsOpen={() => setRemoveGroupOpen(false)}
          focus="cancel"
          onConfirm={() => onRemoveGroup(selectedGroup)}
        >
          Are you sure you want to remove {prediction.name} from{" "}
          {selectedGroup.name}?
          <br />
          <br />
          You can add the group back at any time with the name and passcode.
        </Confirm>
      )}
    </div>
  );
};

export default PredictionGroupList;
