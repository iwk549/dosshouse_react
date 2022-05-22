import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TabbedArea from "react-tabbed-area";

import LoadingContext from "../../context/loadingContext";
import Header from "../common/pageSections/header";
import MyInfo from "./myInfo";
import ProfileSettings from "./profileSettings";
import RegistrationModalForm from "./registrationModalForm";
import {
  refreshUser,
  logout,
  deleteUser,
  editUser,
} from "../../services/userService";
import { toast } from "react-toastify";

const Profile = () => {
  let navigate = useNavigate();
  const { user, setLoading, setUser } = useContext(LoadingContext);
  const tabs = ["My Info", "Settings"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [registerFormOpen, setRegisterFormOpen] = useState(!user);

  const loadData = async () => {
    setLoading(true);
    const res = await refreshUser();
    if (res.status === 200) setUser();
    else toast.error(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const isTab = (includes) => {
    return selectedTab.toLowerCase().includes(includes.toLowerCase());
  };

  const handleEdit = async (info) => {
    setLoading(true);
    const res = await editUser(info);
    if (res.status === 200) {
      setUser();
      toast.success("Info Saved");
    } else toast.error(res.data);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
    setUser();
    navigate("/home");
  };

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteUser();
    if (res.status === 200) {
      toast.info("Account deleted");
      setUser();
      navigate("/home");
    } else toast.error(res.data);
    setLoading(false);
  };

  return user ? (
    <div>
      <Header text="Profile" />
      <TabbedArea
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        tabPlacement="top"
      >
        {isTab("info") ? (
          <MyInfo user={user} onEdit={handleEdit} />
        ) : isTab("settings") ? (
          <ProfileSettings onLogout={handleLogout} onDelete={handleDelete} />
        ) : null}
      </TabbedArea>
    </div>
  ) : (
    <RegistrationModalForm
      header="Login or Register"
      isOpen={registerFormOpen}
      setIsOpen={setRegisterFormOpen}
      onSuccess={() => {
        setRegisterFormOpen(false);
        setUser();
        setLoading(false);
      }}
    />
  );
};

export default Profile;
