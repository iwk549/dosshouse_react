import React, { useState } from "react";

import TabbedArea from "../common/pageSections/tabbedArea";
import ComingSoon from "../common/comingSoon";
import PlaylistRecommendations from "./playlistRecommendations/playlistRecommendations";
import Header from "../common/pageSections/header";

const SpotifyMain = ({}) => {
  const tabs = ["playlist Recommendations", "Other"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  return (
    <>
      <Header text="Spotify API" />
      <TabbedArea
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        tabPlacement="top"
      >
        {selectedTab === "playlist Recommendations" ? (
          <PlaylistRecommendations />
        ) : (
          <ComingSoon />
        )}
      </TabbedArea>
    </>
  );
};

export default SpotifyMain;
