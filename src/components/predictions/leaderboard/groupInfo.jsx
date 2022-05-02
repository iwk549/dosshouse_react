import React, { useState, useEffect, useContext, useRef } from "react";

const GroupInfo = ({ groupInfo }) => {
  return (
    <>
      <div className="pop-box">
        <h2>
          <b>{groupInfo.name}</b>
        </h2>
      </div>
      Group Owner: <b>{groupInfo.ownerID.name}</b>
    </>
  );
};

export default GroupInfo;
