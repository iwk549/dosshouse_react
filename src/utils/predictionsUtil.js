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

const cascadeGroupChanges = (groups, playoffMatches) => {
  let newPlayoffMatches = [];
  let newPlayoffs = [];
  let previousTeams = {};
  let newTeams = {};
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
      const getTeamsFrom = m.getTeamsFrom;
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
  return { playoffs: newPlayoffs, playoffMatches: newPlayoffMatches };
};

const handleUpdateBracketWinners = (playoffMatches, match, winner) => {
  let playoffs = [];
  let newPlayoffMatches = [];
  let thisTeam;
  playoffMatches.forEach((m) => {
    let newMatch = { ...m };
    if (newMatch.round > 1) {
      ["home", "away"].forEach((t) => {
        if (
          newMatch.getTeamsFrom[t].matchNumber ===
          (match.metadata?.matchNumber || match.matchNumber)
        ) {
          newMatch[t + "TeamName"] = match[winner + "TeamName"];
          thisTeam = m[t + "TeamName"];
        }
      });
      if (thisTeam) {
        ["home", "away"].forEach((t) => {
          if (newMatch[t + "TeamName"] === thisTeam) {
            newMatch[t + "TeamName"] = match[winner + "TeamName"];
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

  return { playoffs: playoffs, playoffMatches: newPlayoffMatches };
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
    isSaved: false,
  };
};

export function predictionReducer(state, action) {
  let groups = state.groups;
  let playoffs = state.playoffs;
  let playoffMatches = state.playoffMatches;
  let isSaved = false;
  if (action.type === "save") {
    return { groups, playoffs, playoffMatches, isSaved: true };
  } else if (action.type === "edit") {
    return { groups, playoffs, playoffMatches, isSaved };
  }
  if (action.type === "initial") {
    groups = action.groups;
    playoffs = action.playoffs;
    playoffMatches = action.playoffMatches;
  } else if (action.type === "populate") {
    return handlePopulateBracket(
      action.groups,
      action.playoffs,
      action.playoffMatches
    );
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
      action.winner
    );
    playoffs = winners.playoffs;
    playoffMatches = winners.playoffMatches;
  }
  const updated = cascadeGroupChanges(groups, playoffMatches);
  playoffMatches = updated.playoffMatches;
  playoffs = updated.playoffs;
  return { groups, playoffs, playoffMatches, isSaved };
}
