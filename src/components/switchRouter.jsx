import React, { useState, useEffect, useContext, useRef } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./home/home";
import SpotifyApi from "./spotifyApi/spotifyApi";

const SwitchRouter = ({}) => {
  return (
    <div className="content">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/spotify_api" element={<SpotifyApi />} />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </div>
  );
};

export default SwitchRouter;
