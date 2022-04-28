import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getLeaderboard,
  getUnownedPrediction,
} from "../../../services/predictionsService";
import LoadingContext from "../../../context/loadingContext";
import LeaderboardTable from "./leaderboardTable";
import LeaderboardModal from "./leaderboardModal";
import { getMatches } from "../../../services/matchService";
import { getCompetition } from "../../../services/competitionService";
import PageSelection from "../../common/pageSections/pageSelection";

const PredictionsLeaderboard = ({ competitionID }) => {
  let navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [competition, setCompetition] = useState([]);
  const [originalMatches, setOriginalMatches] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [singlePredictionOpen, setSinglePredictionOpen] = useState(false);
  const [predictionCount, setPredictionCount] = useState(0);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(1);

  const loadLeaderboard = async (selectedPage, updatedResultsPerPage) => {
    setLoading(true);
    const leaderboardRes = await getLeaderboard(
      competitionID,
      selectedPage || page,
      updatedResultsPerPage || resultsPerPage
    );
    if (leaderboardRes.status === 200) {
      setPage(selectedPage || page);
      setResultsPerPage(updatedResultsPerPage || resultsPerPage);
      setLeaderboard(leaderboardRes.data.predictions);
      setPredictionCount(leaderboardRes.data.count);
    } else toast.error(leaderboardRes.data);
    setLoading(false);
  };

  const loadData = async () => {
    setLoading(true);
    const matchesRes = await getMatches(competitionID);
    const competitionRes = await getCompetition(competitionID);

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

    loadLeaderboard();
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
      <button
        className="btn btn-light"
        onClick={() => navigate("/predictions")}
      >
        Go Back
      </button>
      <br />
      <br />
      <b>Overall Leaderboard</b>
      <LeaderboardTable
        leaderboard={leaderboard}
        onSelectPrediction={handleSelectPrediction}
      />
      <PageSelection
        totalCount={predictionCount}
        displayPerPage={resultsPerPage}
        pageNumber={page}
        onSelectPage={(page) => loadLeaderboard(page)}
        onClickCaret={(movement) => loadLeaderboard(page + movement)}
        resultsSelectionArray={[25, 50, 100]}
        onUpdateResultsPerPage={(selection) => loadLeaderboard(1, selection)}
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
