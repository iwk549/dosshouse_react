import { getFinalRound } from "./bracketsUtil";
import { toast } from "react-toastify";

import logos from "../textMaps/logos";

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
  const finalRound = getFinalRound(playoffMatches);

  playoffMatches.forEach((m) => {
    let newMatch = { ...m };
    if (newMatch.round === 1) {
      // for first round get teams from group rankings
      ["home", "away"].forEach((t) => {
        const group = newMatch.getTeamsFrom[t].groupName;
        const position = newMatch.getTeamsFrom[t].position;
        const teamToInsert = groups[group]
          ? groups[group][position - 1].name
          : newMatch[t + "TeamName"];
        newMatch[t + "TeamName"] = teamToInsert;
        newMatch[t + "TeamLogo"] = logos[teamToInsert];
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
            newMatch[t + "TeamLogo"] = logos[newPicks[pickIndex]];
          }
          if (newMatch.round === finalRound) {
            if (
              currentPick === misc.winner &&
              newPicks[pickIndex] &&
              misc.winner === previousPicks[pickIndex]
            ) {
              newMisc.winner = newPicks[pickIndex];
              toast.info(`Updated champion to ${newPicks[pickIndex]}`);
            }
          }
          if (
            misc.thirdPlace &&
            m.round === finalRound - 1 &&
            newPicks[pickIndex] &&
            previousPicks[pickIndex] === misc.thirdPlace
          ) {
            newMisc.thirdPlace = newPicks[pickIndex];
            toast.info(`Third place pick updated to ${newPicks[pickIndex]}`);
          }
        }
      });
    }
    newPlayoffMatches.push(newMatch);
    newPlayoffs.push({
      matchNumber: newMatch.metadata?.matchNumber || newMatch.matchNumber,
      homeTeam: newMatch.homeTeamName,
      awayTeam: newMatch.awayTeamName,
      round: newMatch.round,
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
  const teamToInsert = match[winner + "TeamName"];

  playoffMatches.forEach((m) => {
    let newMatch = { ...m };
    if (newMatch.round > 1) {
      ["home", "away"].forEach((t) => {
        if (
          newMatch.getTeamsFrom[t].matchNumber ===
          (match.metadata?.matchNumber || match.matchNumber)
        ) {
          newMatch[t + "TeamName"] = teamToInsert;
          newMatch[t + "TeamLogo"] = logos[teamToInsert];
          teamToReplace = m[t + "TeamName"];
        }
        if (newMatch.round === finalRound && teamToReplace === misc.winner) {
          newMisc.winner = teamToInsert;
        }
        if (
          newMatch.round === finalRound &&
          misc.thirdPlace &&
          misc.teamToReplace !== misc.thirdPlace &&
          misc.thirdPlace === teamToInsert &&
          m[t + "TeamName"].includes(teamToReplace)
        ) {
          newMisc.thirdPlace = teamToReplace;
          toast.info(`Third place pick updated to ${teamToReplace}`);
        }
        if (
          misc.thirdPlace &&
          teamToInsert !== misc.thirdPlace &&
          newMatch.round === finalRound - 1 &&
          teamToReplace &&
          teamToReplace === m[t + "TeamName"] &&
          teamToReplace === misc.thirdPlace
        ) {
          newMisc.thirdPlace = teamToInsert;
          toast.info(`Third place pick updated to ${teamToInsert}`);
        }
      });

      if (teamToReplace) {
        ["home", "away"].forEach((t) => {
          if (newMatch[t + "TeamName"] === teamToReplace) {
            newMatch[t + "TeamName"] = teamToInsert;
            newMatch[t + "TeamLogo"] = logos[teamToInsert];
          }
        });
      }
    }
    playoffs.push({
      matchNumber: newMatch.metadata?.matchNumber || newMatch.matchNumber,
      homeTeam: newMatch.homeTeamName,
      awayTeam: newMatch.awayTeamName,
      round: newMatch.round,
    });
    newPlayoffMatches.push(newMatch);
  });

  if (match.round === finalRound) newMisc.winner = teamToInsert;

  return {
    playoffs,
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
    playoffMatch.homeTeamLogo = logos[p.homeTeam];
    playoffMatch.awayTeamName = p.awayTeam;
    playoffMatch.awayTeamLogo = logos[p.awayTeam];
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
    if (
      !misc[pick.name] ||
      misc[pick.name].toLowerCase().includes("winner") ||
      misc[pick.name].toLowerCase().includes("loser")
    )
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
  }
  if (!isLocked) {
    if (action.type === "update") {
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
  }
  if (action.type !== "winner") {
    const updated = cascadeGroupChanges(groups, playoffMatches, misc);
    playoffMatches = updated.playoffMatches;
    playoffs = updated.playoffs;
    misc = updated.misc;
  }
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
