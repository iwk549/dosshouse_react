import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationModalForm from "../../user/registrationModalForm";

const NotAllowed = ({ code }) => {
  let navigate = useNavigate();
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  return (
    <div>
      <p>
        {code === 400
          ? "You must be logged in to view your submissions"
          : code === 404
          ? "Access denied. This submission does not belong to you"
          : "Something went wrong, please reload or return the the predictions page"}
      </p>
      {code === 400 && (
        <>
          <button
            className="btn btn-block btn-dark"
            onClick={() => setRegisterFormOpen(true)}
          >
            Login
          </button>
          <br />
          <br />
          <br />
          <RegistrationModalForm
            header="Login or Register to View Your Predictions"
            isOpen={registerFormOpen}
            setIsOpen={setRegisterFormOpen}
            onSuccess={() => {
              setRegisterFormOpen(false);
              window.location.reload();
            }}
            selectedTab="login"
          />
        </>
      )}
      <button
        className="btn btn-block btn-light"
        onClick={() => navigate("/competitions")}
      >
        Return to Home
      </button>
    </div>
  );
};

export default NotAllowed;
