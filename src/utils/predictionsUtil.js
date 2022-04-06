import { getFinalRound } from "./bracketsUtil";
import { toast } from "react-toastify";

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

const cascadeGroupChanges = (groups, playoffMatches, misc) => {
  let newPlayoffMatches = [];
  let newPlayoffs = [];
  let previousTeams = {};
  let newTeams = {};
  let newMisc = { ...misc };
  playoffMatches.forEach((m) => {
    let newMatch = { ...m };
    if (newMatch.round === 1) {
      // for first round get teams from group rankings
      ["home", "away"].forEach((t) => {
        const group = newMatch.getTeamsFrom[t].groupName;
        const position = newMatch.getTeamsFrom[t].position;
        newMatch[t + "TeamName"] = groups[group]
          ? groups[group][position - 1].name
          : newMatch[t + "TeamName"];
      });
    } else if (m.round < 1000) {
      // for all other rounds:
      // check for previous predictions
      // if team was updated due to group switching then update picks
      ["home", "away"].forEach((t) => {
        const currentPick = m[t + "TeamName"];
        if (
          !currentPick.toLowerCase().includes("winner") &&
          !currentPick.toLowerCase().includes("loser")
        ) {
          let matchesPreviousRound = false;
          let pickIndex = -1;
          const previousPicks = previousTeams[m.getTeamsFrom[t].matchNumber];
          const newPicks = newTeams[m.getTeamsFrom[t].matchNumber];
          newPicks.forEach((p, i) => {
            if (p === currentPick) matchesPreviousRound = true;
            else if (p !== previousPicks[i]) pickIndex = i;
          });
          if (!matchesPreviousRound) {
            newMatch[t + "TeamName"] = newPicks[pickIndex];
          }
          if (newMatch.round === getFinalRound(playoffMatches)) {
            if (currentPick === misc.winner && newPicks[pickIndex]) {
              newMisc.winner = newPicks[pickIndex];
              toast.info(`Updated champion to ${newPicks[pickIndex]}`);
            }
          }
        }
      });
    }
    newPlayoffMatches.push(newMatch);
    newPlayoffs.push({
      matchNumber: newMatch.metadata?.matchNumber || newMatch.matchNumber,
      homeTeam: newMatch.homeTeamName,
      awayTeam: newMatch.awayTeamName,
    });

    // add match teams for later use
    previousTeams[m.metadata?.matchNumber || m.matchNumber] = [
      m.homeTeamName,
      m.awayTeamName,
    ];
    newTeams[m.metadata?.matchNumber || m.matchNumber] = [
      newMatch.homeTeamName,
      newMatch.awayTeamName,
    ];
  });
  return {
    playoffs: newPlayoffs,
    playoffMatches: newPlayoffMatches,
    misc: newMisc,
  };
};

const handleUpdateBracketWinners = (playoffMatches, match, winner, misc) => {
  let playoffs = [];
  let newPlayoffMatches = [];
  let teamToReplace;
  let newMisc = { ...misc };
  const finalRound = getFinalRound(playoffMatches);
  if (match.round === finalRound) newMisc.winner = match[winner + "TeamName"];

  playoffMatches.forEach((m) => {
    let newMatch = { ...m };
    if (newMatch.round > 1) {
      ["home", "away"].forEach((t) => {
        if (
          newMatch.getTeamsFrom[t].matchNumber ===
          (match.metadata?.matchNumber || match.matchNumber)
        ) {
          newMatch[t + "TeamName"] = match[winner + "TeamName"];
          teamToReplace = m[t + "TeamName"];
        }
      });
      if (
        misc.thirdPlace &&
        newMatch.round === finalRound - 1 &&
        [m.homeTeamName, m.awayTeamName].includes(match[winner + "TeamName"])
      ) {
        if (match[winner + "TeamName"] === misc.thirdPlace) {
          const newThirdPlace =
            m.homeTeamName === misc.thirdPlace
              ? m.awayTeamName
              : m.homeTeamName;
          newMisc.thirdPlace = newThirdPlace;
          toast.info(`Updated third place pick to ${newThirdPlace}`);
        }
      }

      if (teamToReplace) {
        ["home", "away"].forEach((t) => {
          if (newMatch[t + "TeamName"] === teamToReplace) {
            newMatch[t + "TeamName"] = match[winner + "TeamName"];
            if (
              newMatch.round === finalRound &&
              teamToReplace === misc.winner
            ) {
              newMisc.winner = match[winner + "TeamName"];
            }
          }
        });
      }
      playoffs.push({
        matchNumber: newMatch.metadata?.matchNumber || newMatch.matchNumber,
        homeTeam: newMatch.homeTeamName,
        awayTeam: newMatch.awayTeamName,
      });
    }
    newPlayoffMatches.push(newMatch);
  });

  return {
    playoffs: playoffs,
    playoffMatches: newPlayoffMatches,
    misc: newMisc,
  };
};

const handlePopulateBracket = (
  groupPredictions,
  playoffPredictions,
  playoffMatches
) => {
  let groups = {};
  groupPredictions.forEach((g) => {
    groups[g.groupName] = g.teamOrder.map((t) => {
      return { name: t };
    });
  });
  let populatedPlayoffMatches = [];
  playoffPredictions.forEach((p) => {
    let playoffMatch = {
      ...playoffMatches.find(
        (m) => (m.metadata?.matchNumber || m.matchNumber) === p.matchNumber
      ),
    };
    playoffMatch.homeTeamName = p.homeTeam;
    playoffMatch.awayTeamName = p.awayTeam;
    populatedPlayoffMatches.push(playoffMatch);
  });

  return {
    groups,
    playoffs: playoffPredictions,
    playoffMatches: populatedPlayoffMatches,
  };
};

const updateMiscItems = (misc, selection) => {
  let newMisc = { ...misc };
  newMisc[selection.name] = selection.value;
  return newMisc;
};

const checkForCompletion = (playoffPredictions, misc, competition) => {
  // ! NEED TO IMPLEMENT CHECKS
  let missingItems = [];
  if (!misc.winner || misc.winner.toLowerCase().includes("winner"))
    missingItems.push({
      label: "Bracket",
      text: "Pick the tournament champion",
    });
  playoffPredictions.forEach((p) => {
    if (
      p.homeTeam.toLowerCase().includes("winner") ||
      p.awayTeam.toLowerCase().includes("winner")
    )
      missingItems.push({
        label: "Bracket",
        text: `Match #${p.metadata?.matchNumbr || p.matchNumber} Missing Teams`,
      });
  });

  competition.miscPicks.forEach((pick) => {
    if (!misc[pick.name] || misc[pick.name].toLowerCase().includes("winner"))
      missingItems.push({ label: "Miscellaneous", text: pick.label });
  });
  return missingItems;
};

export function predictionReducer(state, action) {
  let groups = state.groups;
  let playoffs = state.playoffs;
  let playoffMatches = state.playoffMatches;
  let misc = state.misc;
  let competition = state.competition;
  let isSaved = false;
  let missingItems = state.missingItems;
  let isLocked = state.isLocked;
  if (action.type === "save") {
    return {
      groups,
      playoffs,
      playoffMatches,
      misc,
      competition,
      isSaved: true,
      missingItems,
    };
  } else if (action.type === "edit") {
    return {
      groups,
      playoffs,
      playoffMatches,
      competition,
      misc,
      isSaved,
      missingItems,
    };
  }
  if (action.type === "initial") {
    groups = action.groups;
    playoffs = action.playoffs;
    playoffMatches = action.playoffMatches;
    competition = action.competition;
    isLocked = action.isLocked;
  } else if (action.type === "populate") {
    const populated = handlePopulateBracket(
      action.groups,
      action.playoffs,
      action.playoffMatches
    );
    groups = populated.groups;
    playoffs = populated.playoffs;
    playoffMatches = populated.playoffMatches;
    isSaved = true;
    isLocked = action.isLocked;
    competition = action.competition;
    misc = action.misc;
  } else if (action.type === "update") {
    groups = handleDrop(
      action.draggedTeam,
      action.droppedOn,
      action.groupName,
      state.groups
    );
  } else if (action.type === "reorder") {
    groups = handleReorder(
      action.selectedTeam,
      action.direction,
      action.groupName,
      state.groups
    );
  } else if (action.type === "winner") {
    const winners = handleUpdateBracketWinners(
      playoffMatches,
      action.match,
      action.winner,
      misc
    );
    playoffs = winners.playoffs;
    playoffMatches = winners.playoffMatches;
    misc = winners.misc;
  } else if (action.type === "misc") {
    misc = updateMiscItems(misc, action.selection);
  }
  const updated = cascadeGroupChanges(groups, playoffMatches, misc);
  playoffMatches = updated.playoffMatches;
  playoffs = updated.playoffs;
  misc = updated.misc;
  missingItems = checkForCompletion(playoffs, misc, competition);
  toast.clearWaitingQueue();
  return {
    groups,
    playoffs,
    playoffMatches,
    misc,
    competition,
    isSaved,
    missingItems,
    isLocked,
  };
}
