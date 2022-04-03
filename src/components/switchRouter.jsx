import React, { useState, useEffect, useContext, useRef } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ActiveSites from "./activeSites/activeSites";

import Home from "./home/home";
import SpotifyMain from "./spotifyApi/spotifyMain";
import PredictionsHome from "./predictions/predictionsHome";

const SwitchRouter = ({}) => {
  return (
    <div className="content">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/spotify_api" element={<SpotifyMain />} />
        <Route path="/active_sites" element={<ActiveSites />} />
        <Route path="/predictions" element={<PredictionsHome />} />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </div>
  );
};

export default SwitchRouter;
