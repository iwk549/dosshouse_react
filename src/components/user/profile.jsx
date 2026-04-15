import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SegmentedControl from "../common/pageSections/segmentedControl";

import LoadingContext from "../../context/loadingContext";
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
    window.location = "home";
  };

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteUser();
    if (res.status === 200) {
      toast.info("Account deleted");
      setUser();
      window.location = "home";
    } else toast.error(res.data);
    setLoading(false);
  };

  return user ? (
    <div className="page-container">
      <div className="standout-header">Profile</div>
      <SegmentedControl
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      <div className="content-box">
        {isTab("info") ? (
          <MyInfo user={user} onEdit={handleEdit} />
        ) : isTab("settings") ? (
          <ProfileSettings onLogout={handleLogout} onDelete={handleDelete} />
        ) : null}
      </div>
    </div>
  ) : (
    <RegistrationModalForm
      header="Login or Register"
      isOpen={registerFormOpen}
      setIsOpen={() => {
        setRegisterFormOpen(false);
        navigate("/home");
      }}
      onSuccess={() => {
        setRegisterFormOpen(false);
        setUser();
        setLoading(false);
      }}
    />
  );
};

export default Profile;
