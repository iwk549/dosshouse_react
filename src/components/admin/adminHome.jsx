import { useState } from "react";
import SegmentedControl from "../common/pageSections/segmentedControl";
import AdminUsers from "./adminUsers";

const tabs = ["Users"];

const AdminHome = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

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
          {selectedTab === "Users" && <AdminUsers />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
