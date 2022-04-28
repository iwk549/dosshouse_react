import React, { useState, useEffect, useContext, useRef } from "react";

const GroupInfo = ({ groupInfo }) => {
  return (
    <div className="pop-box">
      <div className="mini-div-line" />
      Group Name: <b>{groupInfo.name}</b>
      <br />
      Group Owner: <b>{groupInfo.ownerID.name}</b>
      <div className="mini-div-line" />
    </div>
  );
};

export default GroupInfo;
