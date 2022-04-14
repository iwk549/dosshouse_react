import React, { useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify";

import { getLeaderboard } from "../../services/predictionsService";
import LoadingContext from "../../context/loadingContext";
import LeaderboardTable from "./leaderboardTable";

const PredictionsLeaderboard = ({ competitionID }) => {
  const { setLoading, user } = useContext(LoadingContext);
  const [leaderboard, setLeaderboard] = useState([]);

  const loadData = async () => {
    setLoading(true);
    const res = await getLeaderboard(competitionID);
    if (res.status === 200) setLeaderboard(res.data);
    else toast.error(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <LeaderboardTable leaderboard={leaderboard} />
    </div>
  );
};

export default PredictionsLeaderboard;
