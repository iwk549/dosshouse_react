import { useState, useEffect, useContext } from "react";
import LoadingContext from "../../context/loadingContext";
import { getActiveCompetitions, getExpiredCompetitions } from "../../services/competitionService";
import SegmentedControl from "../common/pageSections/segmentedControl";
import AdminUsers from "./adminUsers";
import AdminTools from "./adminTools";
import AdminCompetitions from "./adminCompetitions";

const tabs = ["Competitions", "Users", "Tools"];

const AdminHome = () => {
  const { setLoading } = useContext(LoadingContext);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [activeRes, expiredRes] = await Promise.all([
        getActiveCompetitions(),
        getExpiredCompetitions(),
      ]);
      const active = activeRes?.status === 200 ? activeRes.data : [];
      const expired = expiredRes?.status === 200 ? expiredRes.data : [];
      setCompetitions([...active, ...expired]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <div className="standout-header">Admin</div>
      <div className="page-container">
        <SegmentedControl
          tabs={tabs}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
        <div className="content-box">
          {selectedTab === "Tools" && <AdminTools competitions={competitions} />}
          {selectedTab === "Competitions" && <AdminCompetitions competitions={competitions} />}
          {selectedTab === "Users" && <AdminUsers />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
