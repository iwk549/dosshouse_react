import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
// import ActiveSites from "./activeSites/activeSites";

// import Home from "./home/home";
// import SpotifyMain from "./spotifyApi/spotifyMain";
import PredictionsRedirect from "./predictions/predictionsRedirect";
import AdminHome from "./admin/adminHome";
import AdminRoute from "./common/routing/adminRoute";
import Profile from "./user/profile";
import StandAloneLogin from "./user/standAloneLogin";
import TipJarThankYou from "./tipJar/tipJarThankYou";

const SwitchRouter = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="/home" element={<Home />} />
        <Route path="/spotify_api" element={<SpotifyMain />} />
        <Route path="/active_sites" element={<ActiveSites />} /> */}
        <Route path="/competitions" element={<PredictionsRedirect />} />
        <Route
          path="/submissions"
          element={<PredictionsRedirect page="submissions" />}
        />
        <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<StandAloneLogin />} />
        <Route path="/thankyou" element={<TipJarThankYou />} />
        <Route path="*" element={<Navigate replace to="/competitions" />} />
      </Routes>
    </div>
  );
};

export default SwitchRouter;
