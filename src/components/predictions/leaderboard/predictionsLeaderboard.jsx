import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getLeaderboard,
  searchLeaderboard,
  getUnownedPrediction,
  forceRemovePredictionFromGroup,
} from "../../../services/predictionsService";
import LoadingContext from "../../../context/loadingContext";
import LeaderboardTable from "./leaderboardTable";
import LeaderboardViewPredictionModal from "./leaderboardViewPredictionModal";
import LeaderboardInviteModal from "./leaderboardInviteModal";
import { getMatches } from "../../../services/matchService";
import { getCompetition } from "../../../services/competitionService";
import PageSelection from "../../common/pageSections/pageSelection";
import GroupInfo from "./groupInfo";
import { getResult } from "../../../services/resultsService";
import Confirm from "../../common/modal/confirm";
import BonusPickInfo from "./bonusPickInfo";

const PredictionsLeaderboard = ({ competitionID, groupID, isSecondChance }) => {
  let navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [competition, setCompetition] = useState([]);
  const [originalMatches, setOriginalMatches] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [singlePredictionOpen, setSinglePredictionOpen] = useState(false);
  const [predictionCount, setPredictionCount] = useState(0);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    groupID === "all" ? 25 : 100
  );
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [forceRemoveOpen, setForceRemoveOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [bonusPicksOpen, setBonusPicksOpen] = useState(false);

  const loadLeaderboard = async (
    selectedPage,
    updatedResultsPerPage,
    search
  ) => {
    setLoading(true);
    let leaderboardRes;
    if (search) {
      setSearched(true);
      leaderboardRes = await searchLeaderboard(
        competitionID,
        groupID,
        search,
        isSecondChance
      );
    } else {
      setSearched(false);
      leaderboardRes = await getLeaderboard(
        competitionID,
        selectedPage || page,
        updatedResultsPerPage || resultsPerPage,
        groupID,
        isSecondChance
      );
    }
    if (leaderboardRes.status === 200) {
      setPage(selectedPage || page);
      setResultsPerPage(updatedResultsPerPage || resultsPerPage);
      setLeaderboard(leaderboardRes.data.predictions);
      setPredictionCount(leaderboardRes.data.count);
      setGroupInfo(leaderboardRes.data.groupInfo);
    } else toast.error(leaderboardRes.data);
    setLoading(false);
  };

  const loadData = async () => {
    setLoading(true);
    const matchesRes = await getMatches(competitionID);
    const competitionRes = await getCompetition(competitionID);
    const resultRes = await getResult(competitionID);

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
        if (resultRes && resultRes.status === 200) {
          setResult(resultRes.data);
          // do not give error here, results may not exist yet
        }
      } else toast.error(competitionRes.data);
    } else toast.error(matchesRes.data);

    loadLeaderboard();
  };

  useEffect(() => {
    loadData();
  }, [isSecondChance]);

  const handleSelectPrediction = async (prediction) => {
    if (!prediction) return;

    if (new Date(competition.submissionDeadline) > new Date()) {
      setSelectedPrediction(prediction);
      setSinglePredictionOpen(true);
    } else {
      setLoading(true);
      const res = await getUnownedPrediction(prediction._id);
      if (res.status === 200) {
        setSelectedPrediction(res.data);
        setSinglePredictionOpen(true);
      } else if (res.data.toLowerCase().includes("token"))
        toast.error("You must be logged in to view individual submissions");
      else toast.error(res.data);
    }

    setLoading(false);
  };

  const handleForceRemovePrediction = async (prediction) => {
    setLoading(true);
    const res = await forceRemovePredictionFromGroup(prediction._id, groupInfo);
    if (res.status === 200) {
      toast.success(`${prediction.name} has been removed from your group`);
      setSinglePredictionOpen(false);
      return loadLeaderboard();
    } else toast.error(res.data);
    setLoading(false);
  };

  return (
    <div>
      <button
        key="goback"
        className="btn btn-light"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
      <br />
      <div className="standout-header">
        {competition.name}
        {isSecondChance ? <small> - Second Chance</small> : null}
      </div>
      <GroupInfo
        groupInfo={groupInfo || { name: "Sitewide" }}
        setInviteOpen={setInviteOpen}
      />
      {competition.secondChance && (
        <button
          key="switch"
          className="btn btn-info"
          onClick={() =>
            navigate(
              `/competitions?leaderboard=show&competitionID=${competitionID}&groupID=${groupID}&secondChance=${!isSecondChance}`,
              { replace: true }
            )
          }
        >
          View {isSecondChance ? "Full" : "Second Chance"} Leaderboard
        </button>
      )}
      <LeaderboardTable
        leaderboard={leaderboard}
        onSelectPrediction={handleSelectPrediction}
        onForceRemovePrediction={handleForceRemovePrediction}
        groupInfo={groupInfo}
        onSearch={(value) => loadLeaderboard(null, null, value)}
        hasSearched={searched}
        setForceRemoveOpen={setForceRemoveOpen}
        setSelectedPrediction={setSelectedPrediction}
        isSecondChance={isSecondChance}
      />
      {leaderboard.length === 0 && (
        <b>No submissions found{searched ? " using the search terms" : ""}.</b>
      )}
      {!isSecondChance && (
        <BonusPickInfo
          isOpen={bonusPicksOpen}
          setIsOpen={setBonusPicksOpen}
          result={result}
          submissions={leaderboard}
        />
      )}
      {!searched && leaderboard.length > 0 && (
        <PageSelection
          totalCount={predictionCount}
          displayPerPage={resultsPerPage}
          pageNumber={page}
          onSelectPage={(page) => loadLeaderboard(page)}
          onClickCaret={(movement) => loadLeaderboard(page + movement)}
          resultsSelectionArray={[25, 50, 100]}
          onUpdateResultsPerPage={(selection) => loadLeaderboard(1, selection)}
        />
      )}
      {selectedPrediction && (
        <LeaderboardViewPredictionModal
          prediction={selectedPrediction}
          isOpen={singlePredictionOpen}
          setIsOpen={setSinglePredictionOpen}
          originalMatches={originalMatches}
          competition={competition}
          allTeams={allTeams}
          result={result}
          setForceRemoveOpen={setForceRemoveOpen}
          setSelectedPrediction={setSelectedPrediction}
          groupInfo={groupInfo}
          isSecondChance={isSecondChance}
        />
      )}
      {selectedPrediction && (
        <Confirm
          header="Confirm Remove Prediction"
          isOpen={forceRemoveOpen}
          setIsOpen={() => setForceRemoveOpen(false)}
          focus="cancel"
          onConfirm={() => handleForceRemovePrediction(selectedPrediction)}
        >
          <b>{selectedPrediction.name}</b>
          <br />
          Are you sure you want to remove this submission from your group?
          <br />
          If you do not want the user to be able to re-add their prediction to
          this group you should change the group passcode.
        </Confirm>
      )}
      {groupInfo && (
        <LeaderboardInviteModal
          isOpen={inviteOpen}
          setIsOpen={setInviteOpen}
          group={groupInfo}
          competition={competition}
        />
      )}
    </div>
  );
};

export default PredictionsLeaderboard;
