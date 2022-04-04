import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { useNavigate } from "react-router-dom";
import BracketPicker from "./bracketPicker";
import GroupPicker from "./groupPicker";
// import {
//   getPickemMatches,
//   savePredictions,
// } from "../../services/pickemService";
import { toast } from "react-toastify";
// import {
//   getCurrentUser,
//   registerNewPickemAccount,
// } from "../../services/userService";
import LoadingContext from "../../context/loadingContext";
import RegistrationModalForm from "../user/registrationModalForm";
import { getMatches } from "../../services/matchesService";
import { predictionReducer } from "../../utils/predictionsUtil";

const PredictionsHome = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const [isLocked, setIsLocked] = useState(true);
  const [predictions, dispatchPredictions] = useReducer(predictionReducer, {
    groups: {},
    playoffs: [],
    playoffMatches: [],
  });
  const [groupMatches, setGroupMatches] = useState({});
  // const [groups, dispatchGroups] = useReducer(groupReducer, {});
  const [bracketCode, setBracketCode] = useState("worldCup2022");
  const [predictionID, setPredictionID] = useState("");
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
        if (!locked && m.locked) locked = true;
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
                flag: m[t + "TeamFlag"],
              });
            }
          });
        } else if (m.type === "Playoff") filtered.playoffMatches.push(m);
      });

      setIsLocked(locked);

      // dispatchGroups({ type: "initial", groups: filtered.groups });

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

  const handleRegisterNewAccount = async (data) => {
    //   setProgress(1);
    //   setLoading(true);
    //   const res = await registerNewPickemAccount(data, {
    //     callback: (p) => setProgress(p),
    //     bar: 0,
    //   });
    //   console.log(res);
    //   if (res.status === 200) {
    //     await handleSavePredictions();
    //     // window.location.reload();
    //   } else toast.error(res.data);
    //   setLoading(false);
  };

  const handleSavePredictions = async () => {
    // const user = getCurrentUser();
    // if (!user) return setRegisterFormOpen(true);
    // setLoading(true);
    // let groupPredictions = [];
    // Object.keys(groups).forEach((k) => {
    //   groupPredictions.push({
    //     groupName: k,
    //     teamOrder: groups[k].map((t) => t.name),
    //   });
    // });
    // const res = await savePredictions(
    //   predictionID,
    //   groupPredictions,
    //   playoffPredictions,
    //   bracketCode,
    //   {
    //     callback: (p) => setProgress(p),
    //     bar: 0,
    //   }
    // );
    // console.log(res);
    // if (res.status === 200) {
    //   history.push(`?q=${res.data}`);
    //   getPredictionID();
    //   toast.success("Predictions saved");
    // } else toast.error(res.data);
    // setLoading(false);
  };

  const handleSelectTeam = (match, team) => {
    dispatchPredictions({ type: "winner", match, winner: team });
  };

  return (
    <div>
      <button className="btn btn-sm btn-block" onClick={handleSavePredictions}>
        Save
      </button>
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
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSubmit={handleRegisterNewAccount}
      />
      <hr />
    </div>
  );
};

export default PredictionsHome;
