import React, { useState, useEffect, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import TabbedArea from "react-tabbed-area";

import { splitName } from "../../../utils/allowables";
import BracketPicker from "./bracketPicker";
import GroupPicker from "./groupPicker";
import { toast } from "react-toastify";
import LoadingContext from "../../../context/loadingContext";
import RegistrationModalForm from "../../user/registrationModalForm";
import { getMatches } from "../../../services/matchService";
import { predictionReducer } from "../../../utils/predictionsUtil";
import {
  savePredictions,
  getPrediction,
} from "../../../services/predictionsService";
import { getCompetition } from "../../../services/competitionService";
import HeaderLine from "./headerLine";
import Miscellaneous from "./miscellaneous";
import Information from "./information";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import NotAllowed from "./notAllowed";

const PredictionMaker = ({ competitionID, predictionID }) => {
  let navigate = useNavigate();
  const { isMobile } = useWindowDimensions();
  const { user, setLoading } = useContext(LoadingContext);
  const [notAllowed, setNotAllowed] = useState(200);
  const [predictions, dispatchPredictions] = useReducer(predictionReducer, {
    groups: {},
    playoffs: [],
    playoffMatches: [],
    competition: {},
    misc: {
      winner: "",
    },
    isSaved: false,
    isLocked: false,
    missingItems: [],
  });
  const [groupMatches, setGroupMatches] = useState({});
  const [originalPlayoffMatches, setOriginalPlayoffMatches] = useState([]);
  const [predictionName, setPredictionName] = useState("");
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const tabs = ["Group", "Bracket", "Bonus", "Information"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [allTeams, setAllTeams] = useState([]);
  const [bracketIsPortrait, setBracketIsPortrait] = useState(isMobile);

  const loadData = async () => {
    setLoading(true); // get matches from db

    const filtered = {
      groups: {},
      groupMatches: {},
      playoffMatches: [],
    };
    let addedTeamTracker = [];
    const matchesRes = await getMatches(competitionID); // get competition info

    const competitionRes = await getCompetition(competitionID);
    if (competitionRes.status !== 200) toast.error(competitionRes.data);
    const isLocked =
      new Date(competitionRes.data?.submissionDeadline) <= new Date();

    if (matchesRes.status === 200) {
      matchesRes.data.forEach((m) => {
        if (m.type === "Group") {
          if (!filtered.groups[m.groupName]) {
            filtered.groups[m.groupName] = [];
            filtered.groupMatches[m.groupName] = [m];
          } else {
            filtered.groupMatches[m.groupName].push(m);
          }

          ["home", "away"].forEach((t) => {
            const teamName = m[t + "TeamName"];

            if (!addedTeamTracker.includes(teamName)) {
              addedTeamTracker.push(teamName);
              filtered.groups[m.groupName].push({
                name: teamName,
              });
            }
          });
        } else if (m.type === "Playoff") filtered.playoffMatches.push(m);
      });
      setGroupMatches(filtered.groupMatches);
      setOriginalPlayoffMatches(filtered.playoffMatches);
      setAllTeams(addedTeamTracker);

      // get saved predictions or set new predictions
      if (predictionID !== "new") {
        // grab predictions from db
        const predictionsRes = await getPrediction(predictionID);

        if (predictionsRes.status === 200) {
          dispatchPredictions({
            type: "populate",
            groups: predictionsRes.data.groupPredictions,
            playoffs: predictionsRes.data.playoffPredictions,
            playoffMatches: filtered.playoffMatches,
            misc: predictionsRes.data.misc,
            competition: competitionRes.data,
            isLocked,
          });
          setPredictionName(predictionsRes.data.name);
        } else {
          toast.error("Could not retrive submission");
          setNotAllowed(predictionsRes.status);
        }
      } else {
        dispatchPredictions({
          type: "initial",
          groups: filtered.groups,
          playoffs: [],
          playoffMatches: filtered.playoffMatches,
          competition: competitionRes.data,
          isLocked,
        });
        if (user) setPredictionName(splitName(user.name) + "'s Bracket");
      }
    } else toast.error(matchesRes.data);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePredictions = async () => {
    if (!user) return setRegisterFormOpen(true);
    setLoading(true);
    const groupPredictions = [];
    Object.keys(predictions.groups).forEach((k) => {
      groupPredictions.push({
        groupName: k,
        teamOrder: predictions.groups[k].map((t) => t.name),
      });
    });
    const res = await savePredictions(predictionID, {
      name: predictionName,
      competitionID,
      groupPredictions,
      playoffPredictions: predictions.playoffs,
      misc: predictions.misc,
    });

    if (res.status === 200) {
      dispatchPredictions({
        type: "save",
      });
      toast.success("Predictions saved");
      navigate(`/predictions?id=${res.data}&competitionID=${competitionID}`, {
        replace: true,
      });
    } else toast.error(res.data);

    setLoading(false);
  };

  const handleSelectBracketWinner = (match, team) => {
    dispatchPredictions({
      type: "winner",
      match,
      winner: team,
    });
  };

  const handleChangeMiscValue = (name, value) => {
    dispatchPredictions({
      type: "misc",
      selection: {
        name,
        value,
      },
    });
  };

  const isTab = (tab) => {
    return selectedTab.toLowerCase().includes(tab.toLowerCase());
  };

  if (notAllowed > 200) return <NotAllowed code={notAllowed} />;

  return (
    <div>
      <HeaderLine
        onSave={handleSavePredictions}
        predictionName={predictionName}
        setPredictionName={(value) => {
          setPredictionName(value);
          dispatchPredictions({
            type: "edit",
          });
        }}
        isSaved={predictions.isSaved}
        isLocked={predictions.isLocked}
        competition={predictions.competition}
        missingItems={predictions.missingItems}
      />
      <br />
      <TabbedArea
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        tabPlacement="top"
      >
        <div className="text-center">
          {isTab("group") ? (
            <GroupPicker
              groups={predictions.groups}
              onDrop={dispatchPredictions}
              onReorder={dispatchPredictions}
              isLocked={predictions.isLocked}
              groupMatches={groupMatches}
            />
          ) : isTab("bracket") ? (
            <BracketPicker
              matches={predictions.playoffMatches}
              onSelectTeam={handleSelectBracketWinner}
              isLocked={predictions.isLocked}
              misc={predictions.misc}
              isPortrait={bracketIsPortrait}
              setIsPortrait={setBracketIsPortrait}
              originalPlayoffMatches={originalPlayoffMatches}
            />
          ) : isTab("bonus") ? (
            <Miscellaneous
              onChange={handleChangeMiscValue}
              misc={predictions.misc}
              playoffMatches={predictions.playoffMatches}
              competition={predictions.competition}
              allTeams={allTeams}
              isLocked={predictions.isLocked}
            />
          ) : isTab("info") ? (
            <Information competition={predictions.competition} />
          ) : null}
        </div>
      </TabbedArea>
      <br />
      <div
        style={{
          float: "right",
        }}
      >
        <button
          className="btn btn-sm btn-light"
          onClick={() => navigate("/predictions?tab=submissions")}
        >
          Exit
        </button>
      </div>
      <RegistrationModalForm
        header="Login or Register to Save Your Predictions"
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSuccess={() => {
          setRegisterFormOpen(false);
          handleSavePredictions();
        }}
      />
    </div>
  );
};

export default PredictionMaker;
