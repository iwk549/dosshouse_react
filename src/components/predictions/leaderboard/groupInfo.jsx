import React, { useContext } from "react";

import LoadingContext from "../../../context/loadingContext";

const GroupInfo = ({ groupInfo, setInviteOpen }) => {
  const { user } = useContext(LoadingContext);

  return (
    <div>
      <div className="standout-header">{groupInfo?.name} Leaderboard</div>
      <div style={{ float: "right" }}></div>
      {groupInfo?.ownerID?.name && (
        <div>
          Group Owner: <b>{groupInfo?.ownerID?.name}</b>
        </div>
      )}
      {groupInfo?.ownerID?._id === user?._id && (
        <button
          className="btn btn-sm btn-dark"
          onClick={() => setInviteOpen(true)}
        >
          Invite Users
        </button>
      )}
    </div>
  );
};

export default GroupInfo;
