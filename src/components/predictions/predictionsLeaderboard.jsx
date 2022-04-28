import React, { useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify";
import {
  getLeaderboard,
  getUnownedPrediction,
} from "../../services/predictionsService";
import LoadingContext from "../../context/loadingContext";
import LeaderboardTable from "./leaderboardTable";
import LeaderboardModal from "./leaderboardModal";
import { getMatches } from "../../services/matchService";
import { getCompetition } from "../../services/competitionService";

const PredictionsLeaderboard = ({ competitionID }) => {
  const { setLoading } = useContext(LoadingContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [competition, setCompetition] = useState([]);
  const [originalMatches, setOriginalMatches] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [singlePredictionOpen, setSinglePredictionOpen] = useState(false);
  const [page, setPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    const leaderboardRes = await getLeaderboard(competitionID, page);
    const matchesRes = await getMatches(competitionID);
    const competitionRes = await getCompetition(competitionID);

    if (leaderboardRes.status === 200) {
      setLeaderboard(leaderboardRes.data);

      if (matchesRes.status) {
        let playoffMatches = [];
        let allTeams = [];
        matchesRes.data.forEach((m) => {
          if (m.type === "Playoff") playoffMatches.push(m);
          if (!allTeams.includes(m.homeTeamName)) allTeams.push(m.homeTeamName);
          if (!allTeams.includes(m.awayTeamName)) allTeams.push(m.awayTeamName);
        });
        setOriginalMatches(playoffMatches);
        setAllTeams(allTeams);
        if (competitionRes.status === 200) {
          setCompetition(competitionRes.data);
        } else toast.error(competitionRes.data);
      } else toast.error(matchesRes.data);
    } else toast.error(leaderboardRes.data);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPrediction = async (prediction) => {
    setLoading(true);
    const res = await getUnownedPrediction(prediction._id);

    if (res.status === 200) {
      setSelectedPrediction(res.data);
      setSinglePredictionOpen(true);
    } else toast.error(res.data);

    setLoading(false);
  };

  return (
    <div>
      <LeaderboardTable
        leaderboard={leaderboard}
        onSelectPrediction={handleSelectPrediction}
      />
      {selectedPrediction && (
        <LeaderboardModal
          prediction={selectedPrediction}
          isOpen={singlePredictionOpen}
          setIsOpen={setSinglePredictionOpen}
          originalMatches={originalMatches}
          competition={competition}
          allTeams={allTeams}
        />
      )}
    </div>
  );
};

export default PredictionsLeaderboard;
