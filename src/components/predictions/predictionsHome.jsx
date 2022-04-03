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

function groupReducer(state, action) {
  switch (action.type) {
    case "initial":
      return action.groups;
    case "update":
      return handleDrop(
        action.draggedTeam,
        action.droppedOn,
        action.groupName,
        state
      );
    case "reorder":
      return handleReorder(
        action.selectedTeam,
        action.direction,
        action.groupName,
        state
      );
  }
}

const handleDrop = (draggedTeam, droppedOn, groupName, state) => {
  let newGroups = { ...state };
  let newTeams = [...newGroups[groupName]];
  const dropAt =
    draggedTeam.position > droppedOn.position
      ? droppedOn.position + 1
      : droppedOn.position;
  let thisTeam = newTeams.splice(draggedTeam.position, 1)[0];
  newTeams.splice(dropAt, 0, thisTeam);
  newGroups[groupName] = newTeams;
  return newGroups;
};

const handleReorder = (selectedTeam, direction, groupName, state) => {
  if (
    (selectedTeam.position === 0 && direction === "up") ||
    (selectedTeam.position === state[groupName].length - 1 &&
      direction === "down")
  )
    return state;
  const position = selectedTeam.position + (direction === "up" ? -2 : 1);
  return handleDrop(selectedTeam, { position }, groupName, state);
};

const PredictionsHome = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const [isLocked, setIsLocked] = useState(true);
  const [playoffMatches, setPlayoffMatches] = useState([]);
  const [playoffPredictions, setPlayoffPredictions] = useState([]);
  const [groupMatches, setGroupMatches] = useState({});
  const [groups, dispatchGroups] = useReducer(groupReducer, {});
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

      dispatchGroups({ type: "initial", groups: filtered.groups });
      setGroupMatches(filtered.groupMatches);
      setPlayoffMatches(filtered.playoffMatches);
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

  return (
    <div>
      <button className="btn btn-sm btn-block" onClick={handleSavePredictions}>
        Save
      </button>
      <GroupPicker
        groups={groups}
        onDrop={dispatchGroups}
        onReorder={dispatchGroups}
        isLocked={isLocked}
        groupMatches={groupMatches}
      />
      <BracketPicker matches={playoffMatches} />
      <RegistrationModalForm
        isOpen={registerFormOpen}
        setIsOpen={setRegisterFormOpen}
        onSubmit={handleRegisterNewAccount}
      />
    </div>
  );
};

export default PredictionsHome;
