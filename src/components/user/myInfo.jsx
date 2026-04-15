import React, { useState } from "react";

import UserInfoForm from "./userInfoForm";

const MyInfo = ({ user, onEdit }) => {
  const [editing, setEditing] = useState(false);

  const raiseEdit = (info) => {
    setEditing(false);
    onEdit(info);
  };

  return (
    <div>
      <div className="info-line">
        <span className="info-line-label">Name</span>
        <span className="info-line-value">{user.name}</span>
      </div>
      <div className="info-line">
        <span className="info-line-label">Email</span>
        <span className="info-line-value">{user.email}</span>
      </div>
      <div style={{ marginTop: "16px" }}>
        <button className="btn btn-info" onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit My Info"}
        </button>
        {editing && <UserInfoForm user={user} onEdit={raiseEdit} />}
      </div>
    </div>
  );
};

export default MyInfo;
