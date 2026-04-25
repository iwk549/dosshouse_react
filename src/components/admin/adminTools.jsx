import { useState } from "react";
import SegmentedControl from "../common/pageSections/segmentedControl";
import AdminToolsMatches from "./adminToolsMatches";
import AdminToolsResults from "./adminToolsResults";

const tabs = ["Matches", "Results"];

const AdminTools = ({ competitions }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div>
      <SegmentedControl
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      <div style={{ marginTop: "16px" }}>
        {selectedTab === "Matches" && <AdminToolsMatches competitions={competitions} />}
        {selectedTab === "Results" && <AdminToolsResults competitions={competitions} />}
      </div>
    </div>
  );
};

export default AdminTools;
