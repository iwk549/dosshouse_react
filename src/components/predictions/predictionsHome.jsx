import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { useNavigate } from "react-router-dom";

import Input from "../common/form/input";
import BracketPicker from "./bracketPicker";
import GroupPicker from "./groupPicker";
import { toast } from "react-toastify";
import LoadingContext from "../../context/loadingContext";
import RegistrationModalForm from "../user/registrationModalForm";
import { getMatches } from "../../services/matchesService";
import { predictionReducer } from "../../utils/predictionsUtil";
import {
  getCurrentUser,
  registerUser,
  loginUser,
} from "../../services/userService";
import { savePredictions } from "../../services/predictionsService";
import HeaderLine from "./headerLine";

const PredictionsHome = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const [isLocked, setIsLocked] = useState(true);
  const [predictions, dispatchPredictions] = useReducer(predictionReducer, {
    groups: {},
    playoffs: [],
    playoffMatches: [],
  });
  const [groupMatches, setGroupMatches] = useState({});
  const [bracketCode, setBracketCode] = useState("worldCup2022");
  const [predictionID, setPredictionID] = useState("");
  const [predictionName, setPredictionName] = useState("");
  const [registerFormOpen, setRegisterFormOpen] = useState(false);

  const getPredictionID = () => {
    const id = window.location.search.split("=");
    setPredictionID(id[1] || "new");
  };

  const loadData = async () => {
    setLoading(true);
    const filtered = {
      groups: {},
      groupMatches: {},
      playoffMatches: [],
    };
    let addedTeamTracker = [];
    const matchesRes = await getMatches(bracketCode);
    getPredictionID();
    let locked = false;
    if (matchesRes.status === 200) {
      matchesRes.data.forEach((m) => {
        if (locked) locked = true;
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

      setIsLocked(locked);

      setGroupMatches(filtered.groupMatches);
      dispatchPredictions({
        type: "initial",
        groups: filtered.groups,
        playoffs: [],
        playoffMatches: filtered.playoffMatches,
      });
    } else toast.error(matchesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitUserForm = async (type, data) => {
    setLoading(true);
    let res;
    if (type === "register") res = await registerUser(data);
    else if (type === "login") res = await loginUser(data);
    if (res.status === 200) {
      setRegisterFormOpen(false);
      await handleSavePredictions();
    } else toast.error(res.data);
    setLoading(false);
  };

  const handleSavePredictions = async () => {
    const user = getCurrentUser();
    if (!user) return setRegisterFormOpen(true);
    setLoading(true);
    console.log(predictions);
    const groupPredictions = [];
    Object.keys(predictions.groups).forEach((k) => {
      groupPredictions.push({
        groupName: k,
        teamOrder: predictions.groups[k].map((t) => t.name),
      });
    });
    const res = await savePredictions(predictionID, {
      name: predictionName,
      bracketCode,
      groupPredictions,
      playoffPredictions: predictions.playoffs,
    });
    console.log(res);
    if (res.status === 200) {
      toast.success("Predictions saved");
    } else toast.error(res.data);
    setLoading(false);
  };

  const handleSelectTeam = (match, team) => {
    dispatchPredictions({ type: "winner", match, winner: team });
  };

  return (
    <div>
      <HeaderLine
        onSave={handleSavePredictions}
        predictionName={predictionName}
        setPredictionName={setPredictionName}
      />
      <GroupPicker
        groups={predictions.groups}
        onDrop={dispatchPredictions}
        onReorder={dispatchPredictions}
        isLocked={isLocked}
        groupMatches={groupMatches}
      />
      <br />
      <BracketPicker
        matches={predictions.playoffMatches}
        onSelectTeam={handleSelectTeam}
      />
      <RegistrationModalForm
        header="Login or Register to Save Your Predictions"
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSubmit={handleSubmitUserForm}
      />
      <hr />
    </div>
  );
};

export default PredictionsHome;
