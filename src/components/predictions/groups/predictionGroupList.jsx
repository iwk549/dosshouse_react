import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Confirm from "../../common/modal/confirm";
import IconRender from "../../common/icons/iconRender";
import SideBySideView from "../../common/pageSections/sideBySideView";

const PredictionGroupList = ({
  prediction,
  setSelectedSubmission,
  setGroupFormOpen,
  onRemoveGroup,
}) => {
  let navigate = useNavigate();
  const [removeGroupOpen, setRemoveGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <>
      <SideBySideView
        Components={[
          <>
            {prediction.groups.map((g, idx) => (
              <React.Fragment key={idx}>
                <>
                  Group Name: <b>{g.name}</b>
                  <br />
                  Group Owner: <b>{g.ownerID?.name}</b>
                  <div className="row">
                    <div style={{ gridColumn: 1 }}>
                      <button
                        className="btn btn-block btn-info"
                        onClick={() =>
                          navigate(
                            `/predictions?leaderboard=show&competitionID=${prediction.competitionID?._id}&groupID=${g._id}`
                          )
                        }
                      >
                        View Group Leaderboard
                      </button>
                    </div>
                    <div style={{ gridColumn: 2 }}>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setSelectedGroup(g);
                          setRemoveGroupOpen(true);
                        }}
                      >
                        <IconRender type="remove" size={15} />
                      </button>
                    </div>
                  </div>
                </>
                <div className="mini-div-line" />
              </React.Fragment>
            ))}
          </>,
          <button
            className="btn btn-sm btn-dark"
            onClick={() => {
              setSelectedSubmission(prediction);
              setGroupFormOpen(true);
            }}
          >
            Manage Groups
          </button>,
        ]}
      />
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
    </>
  );
};

export default PredictionGroupList;
