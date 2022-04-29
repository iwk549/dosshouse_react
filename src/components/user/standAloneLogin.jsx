import React, { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import RegistrationModalForm from "./registrationModalForm";
import LoadingContext from "../../context/loadingContext";

const StandAloneLogin = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const handleResetSuccess = () => {
    navigate("/home");
    setLoading(false);
  };

  return (
    <div>
      <RegistrationModalForm
        isOpen={true}
        setIsOpen={handleResetSuccess}
        selectedTab="reset"
        onSuccess={handleResetSuccess}
        reset={{
          email,
          token,
        }}
      />
    </div>
  );
};

export default StandAloneLogin;
