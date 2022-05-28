import React, { useState } from "react";

import Confirm from "../common/modal/confirm";

const ProfileSettings = ({ onLogout, onDelete }) => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div>
      <br />
      <button className="btn btn-dark" onClick={() => setLogoutOpen(true)}>
        Logout
      </button>
      <br />
      <br />
      <br />
      <br />
      <button className="btn btn-danger" onClick={() => setDeleteOpen(true)}>
        Delete My Account
      </button>

      <Confirm
        header="Logout"
        isOpen={logoutOpen}
        setIsOpen={() => setLogoutOpen(false)}
        focus="cancel"
        onConfirm={onLogout}
        buttonText={["No", "Yes"]}
      >
        Are you sure you want to log out?
      </Confirm>
      <Confirm
        header="Delete Account"
        isOpen={deleteOpen}
        setIsOpen={() => setDeleteOpen(false)}
        focus="cancel"
        onConfirm={onDelete}
        buttonText={["No", "Yes"]}
      >
        All user data will be deleted and cannot be recovered.
        <br />
        <br />
        Are you sure you want to delete your account?
      </Confirm>
    </div>
  );
};

export default ProfileSettings;
