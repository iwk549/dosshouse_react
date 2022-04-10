import React, { useState, useEffect, useContext, useRef } from "react";

import UserInfoForm from "./userInfoForm";

const MyInfo = ({ user, onEdit }) => {
  const [editing, setEditing] = useState(false);

  const raiseEdit = (info) => {
    setEditing(false);
    onEdit(info);
  };

  return (
    <div>
      <button
        className="btn btn-block btn-info"
        onClick={() => setEditing(!editing)}
      >
        {editing ? "Cancel" : "Edit My Info"}
      </button>
      {editing ? (
        <UserInfoForm user={user} onEdit={raiseEdit} />
      ) : (
        <h3>
          <b>{user.name}</b>
        </h3>
      )}
      <b>{user.email}</b>
      <br />
    </div>
  );
};

export default MyInfo;
