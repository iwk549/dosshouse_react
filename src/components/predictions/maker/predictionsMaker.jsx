import { useState, useEffect, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import TabbedArea from "react-tabbed-area";

import { splitName } from "../../../utils/allowables";
import BracketPicker from "./bracketPicker";
import GroupPicker from "./groupPicker";
import { toast } from "react-toastify";
import LoadingContext from "../../../context/loadingContext";
import RegistrationModalForm from "../../user/registrationModalForm";
import { getMatches } from "../../../services/matchService";
import {
  handleUpdateSpecialMatrices,
  predictionReducer,
} from "../../../utils/predictionsUtil";
import {
  savePrediction,
  getPrediction,
  addPredictionToGroup,
} from "../../../services/predictionsService";
import { getResult } from "../../../services/resultsService";
import { getCompetition } from "../../../services/competitionService";
import HeaderLine from "./headerLine";
import Miscellaneous from "./miscellaneous";
import Information from "./information";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import NotAllowed from "./notAllowed";
import Confirm from "../../common/modal/confirm";
import GroupModalForm from "../groups/groupModalForm";

const PredictionMaker = ({
  competitionID,
  predictionID,
  groupName,
  groupPasscode,
  isSecondChance,
}) => {
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
    isSecondChance,
  });
  const [groupMatches, setGroupMatches] = useState({});
  const [originalPlayoffMatches, setOriginalPlayoffMatches] = useState([]);
  const [predictionName, setPredictionName] = useState("");
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [tabs, setTabs] = useState([""]);
  const [selectedTab, setSelectedTab] = useState(
    isSecondChance ? "Bracket" : "Group"
  );
  const [allTeams, setAllTeams] = useState([]);
  const [bracketIsPortrait, setBracketIsPortrait] = useState(isMobile);
  const [confirmGoBackOpen, setConfirmGoBackOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

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
      (isSecondChance
        ? new Date(competitionRes.data?.secondChance?.submissionDeadline)
        : new Date(competitionRes.data?.submissionDeadline)) <= new Date();

    let newTabs = [];
    if (isSecondChance) {
      newTabs = ["Bracket", "Information"];
      if (
        competitionRes.data?.miscPicks?.find((mp) => mp.name === "thirdPlace")
      )
        newTabs.splice(1, 0, "Bonus");
    } else {
      newTabs = ["Group", "Bracket", "Information"];
      if (competitionRes.data?.miscPicks?.length) newTabs.splice(2, 0, "Bonus");
    }
    setTabs(newTabs);

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

      if (competitionRes.data?.groupMatrix) {
        const rankingGroups = handleUpdateSpecialMatrices(
          competitionRes.data,
          filtered.groups
        );
        Object.assign(filtered.groups, rankingGroups);
      }

      setGroupMatches(filtered.groupMatches);
      setOriginalPlayoffMatches(filtered.playoffMatches);
      setAllTeams(addedTeamTracker);

      // get saved predictions or set new predictions
      // if this is a second chance competition we will need the group results
      const resultRes = await getResult(competitionID);

      if (predictionID !== "new") {
        // grab prediction from db
        const predictionsRes = await getPrediction(predictionID);

        if (predictionsRes.status === 200) {
          dispatchPredictions({
            type: "populate",
            groups:
              (isSecondChance
                ? resultRes.data?.group
                : predictionsRes.data?.groupPredictions) || [],
            playoffs: predictionsRes.data?.playoffPredictions || [],
            playoffMatches: filtered.playoffMatches,
            misc: predictionsRes.data?.misc,
            competition: competitionRes.data,
            isLocked,
            isSecondChance,
          });
          setPredictionName(predictionsRes.data?.name || "");
        } else {
          toast.error("Could not retrive submission");
          setNotAllowed(predictionsRes.status);
        }
      } else {
        const groupResults = {};
        resultRes.data?.group?.forEach((g) => {
          groupResults[g.groupName] = g.teamOrder.map((t) => ({ name: t }));
        });
        dispatchPredictions({
          type: "initial",
          groups: isSecondChance ? groupResults : filtered.groups,
          playoffs: [],
          playoffMatches: filtered.playoffMatches,
          competition: competitionRes.data,
          isLocked,
          isSecondChance,
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
    const predictionRes = await savePrediction(predictionID, {
      name: predictionName,
      competitionID,
      groupPredictions,
      playoffPredictions: predictions.playoffs,
      misc: predictions.misc,
      isSecondChance: !!isSecondChance,
    });

    if (predictionRes.status === 200) {
      dispatchPredictions({
        type: "save",
        isSecondChance,
      });
      toast.success("Prediction saved");
      if (groupName && groupPasscode) {
        // if these two params exist attempt to add prediction to the group
        const groupRes = await addPredictionToGroup(predictionRes.data, {
          name: groupName,
          passcode: groupPasscode,
          fromUrl: true,
        });
        if (groupRes.status === 200) toast.success("Prediction added to group");
        else toast.error(groupRes.data);
      }

      navigate(
        `/submissions?id=${
          predictionRes.data
        }&competitionID=${competitionID}&secondChance=${!!isSecondChance}`,
        {
          replace: true,
        }
      );
      setLoading(false);
      return true;
    } else toast.error(predictionRes.data);

    setLoading(false);
    return false;
  };

  const handleSelectBracketWinner = (match, team) => {
    dispatchPredictions({
      type: "winner",
      match,
      winner: team,
      isSecondChance,
    });
  };

  const handleChangeMiscValue = (name, value) => {
    dispatchPredictions({
      type: "misc",
      selection: {
        name,
        value,
      },
      isSecondChance,
    });
  };

  const handleClickMissingItem = (item) => {
    setSelectedTab(item.label);
  };

  const isTab = (tab) => {
    return selectedTab.toLowerCase().includes(tab.toLowerCase());
  };

  if (notAllowed > 200) return <NotAllowed code={notAllowed} />;

  return (
    <div id="scroller">
      <button
        className="btn btn-sm btn-light"
        onClick={() => {
          predictions.isSaved
            ? navigate("/submissions")
            : setConfirmGoBackOpen(true);
        }}
      >
        Go Back
      </button>
      <Confirm
        header="Are You Sure?"
        isOpen={confirmGoBackOpen}
        setIsOpen={() => setConfirmGoBackOpen(false)}
        focus="cancel"
        onConfirm={() => navigate("/submissions")}
        buttonText={["Cancel", "Go Back without Saving"]}
      >
        Your latest changes are unsaved. Are you sure you want to go back and
        discard them?
        <br />
        <br />
        <button
          className="btn btn-dark btn-sm btn-block"
          onClick={async () => {
            const saved = await handleSavePredictions();
            if (saved) navigate("/submissions");
            else setConfirmGoBackOpen(false);
          }}
        >
          Save and Go Back
        </button>
      </Confirm>
      <HeaderLine
        onSave={handleSavePredictions}
        predictionName={predictionName}
        setPredictionName={(value) => {
          setPredictionName(value);
          dispatchPredictions({
            type: "edit",
            isSecondChance,
          });
        }}
        isSaved={predictions.isSaved}
        isLocked={predictions.isLocked}
        competition={predictions.competition}
        missingItems={predictions.missingItems}
        onClickMissingItem={handleClickMissingItem}
        isSecondChance={isSecondChance}
      />
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
              competition={predictions.competition}
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
          className="btn btn-sm btn-info"
          onClick={() => document.querySelector("body").scroll(0, 0)}
        >
          Return To Top of Page
        </button>
      </div>
      {predictionID !== "new" && !isSecondChance && (
        <div style={{ float: "left" }}>
          <button
            className="btn btn-sm btn-dark"
            onClick={() => setGroupModalOpen(true)}
          >
            Add to Group
          </button>
        </div>
      )}
      <RegistrationModalForm
        header="Login or Register to Save Your Predictions"
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSuccess={() => {
          setRegisterFormOpen(false);
          handleSavePredictions();
        }}
      />
      {predictionID !== "new" && (
        <GroupModalForm
          isOpen={groupModalOpen}
          setIsOpen={setGroupModalOpen}
          header="Add Prediction to Group"
          submission={{
            _id: predictionID,
            competitionID: { _id: competitionID },
            name: predictionName,
          }}
          onSuccess={() => setGroupModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PredictionMaker;
