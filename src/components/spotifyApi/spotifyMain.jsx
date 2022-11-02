import React, { useState, useContext, useEffect } from "react";
import TabbedArea from "react-tabbed-area";

import ComingSoon from "../common/comingSoon";
import PlaylistRecommendations from "./playlistRecommendations/playlistRecommendations";
import Header from "../common/pageSections/header";
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
