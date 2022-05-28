import React from "react";

const GroupInfo = ({ groupInfo }) => {
  return (
    <>
      <div className="standout-header">{groupInfo.name}</div>
      Group Owner: <b>{groupInfo.ownerID.name}</b>
    </>
  );
};

export default GroupInfo;
