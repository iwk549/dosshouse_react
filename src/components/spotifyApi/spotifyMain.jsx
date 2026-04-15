import React, { useState, useContext, useEffect } from "react";
import SegmentedControl from "../common/pageSections/segmentedControl";

import ComingSoon from "../common/comingSoon";
import PlaylistRecommendations from "./playlistRecommendations/playlistRecommendations";
import LoadingContext from "../../context/loadingContext";

const SpotifyMain = () => {
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(false);
  }, []);

  const tabs = ["playlist Recommendations", "Other"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  return (
    <>
      <div className="standout-header">Spotify API</div>
      <SegmentedControl
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      {selectedTab === "playlist Recommendations" ? (
        <PlaylistRecommendations />
      ) : (
        <ComingSoon />
      )}
    </>
  );
};

export default SpotifyMain;
