import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PredictionsRedirect from "./predictions/predictionsRedirect";
import CompetitionSocialCard from "./predictions/socialCard/competitionSocialCard";
import AdminHome from "./admin/adminHome";
import AdminRoute from "./common/routing/adminRoute";
import Profile from "./user/profile";
import StandAloneLogin from "./user/standAloneLogin";
import TipJarThankYou from "./tipJar/tipJarThankYou";

const SwitchRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/social-card" element={<AdminRoute><CompetitionSocialCard /></AdminRoute>} />
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
