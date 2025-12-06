import { getFinalRound, getTeamAbbreviation } from "./bracketsUtil";
import { toast } from "react-toastify";

import logos from "../textMaps/logos";

const getGroupNameFromSpecialGroup = (group) => {
  return group?.map((team) => team.name.slice(0, team.name.indexOf(":")));
};

export const handleUpdateSpecialMatrices = (competition, groups) => {
  let rankingGroups = {};

  competition.groupMatrix?.forEach((matrix) => {
    const rankingGroup = [];
    const order = getGroupNameFromSpecialGroup(groups[matrix.key]);
    if (order) {
      order.forEach((group) => {
        rankingGroup.push({
          name: `${group}: ${groups[group][matrix.positionInGroup - 1].name}`,
        });
      });
    } else {
      for (let group in groups) {
        if (group !== matrix.type) {
          rankingGroup.push({
            name: `${group}: ${groups[group][matrix.positionInGroup - 1].name}`,
          });
        }
      }
    }

    rankingGroups[matrix.key] = rankingGroup;
  });

  return rankingGroups;
};

const handleDrop = (draggedTeam, droppedOn, groupName, state, competition) => {
  let newGroups = { ...state };
  let newTeams = [...newGroups[groupName]];
  const dropAt =
    draggedTeam.position > droppedOn.position
      ? droppedOn.position + 1
      : droppedOn.position;
  let thisTeam = newTeams.splice(draggedTeam.position, 1)[0];
  newTeams.splice(dropAt, 0, thisTeam);
  newGroups[groupName] = newTeams;

  if (competition?.groupMatrix?.length) {
    const rankingGroups = handleUpdateSpecialMatrices(competition, newGroups);
    Object.assign(newGroups, rankingGroups);
  }

  return newGroups;
};

const handleReorder = (
  selectedTeam,
  direction,
  groupName,
  state,
  competition
) => {
  if (
    (selectedTeam.position === 0 && direction === "up") ||
    (selectedTeam.position === state[groupName].length - 1 &&
      direction === "down")
  )
    return state;
  const position = selectedTeam.position + (direction === "up" ? -2 : 1);
  return handleDrop(selectedTeam, { position }, groupName, state, competition);
};

export const findCountryLogo = (teamName) => {
  let countryLogo = teamName;
  if (teamName?.includes(":")) {
    countryLogo = teamName.slice(teamName.indexOf(":") + 2);
  }
  if (teamName?.[teamName.length - 1] === ")") {
    const firstParen = teamName.indexOf("(");
    countryLogo = teamName.slice(firstParen + 1, teamName.length - 1);
  }
  return countryLogo;
};

const cascadeGroupChanges = (groups, playoffMatches, misc, competition) => {
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
        let group = newMatch.getTeamsFrom[t].groupName;
        let position = newMatch.getTeamsFrom[t].position;
        if (group.includes("groupMatrix") && competition?.groupMatrix?.length) {
          const groupMatrix = competition.groupMatrix.find(
            (m) => m.key === group.split(".")[1]
          );
          const order = getGroupNameFromSpecialGroup(groups[groupMatrix.key])
            .slice(0, groupMatrix.teamsToIncludeInBracket)
            .sort()
            .join("");
          const actualMatchNumber =
            newMatch.metadata?.matchNumber || newMatch.matchNumber;
          const info = groupMatrix.matrix?.[actualMatchNumber]?.[order];
          group = info?.groupName;
          position = info?.position;
        }

        const teamToInsert = groups[group]
          ? groups[group][position - 1]?.name
          : newMatch[t + "TeamName"];

        newMatch[t + "TeamName"] = teamToInsert;
        newMatch[t + "TeamAbbreviation"] = getTeamAbbreviation(teamToInsert);
        newMatch[t + "TeamLogo"] = logos[findCountryLogo(teamToInsert)];
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
          newPicks?.forEach((p, i) => {
            if (p === currentPick) matchesPreviousRound = true;
            else if (p !== previousPicks[i]) pickIndex = i;
          });
          if (!matchesPreviousRound) {
            newMatch[t + "TeamName"] = newPicks[pickIndex];
            newMatch[t + "TeamAbbreviation"] = getTeamAbbreviation(
              newPicks[pickIndex]
            );
            newMatch[t + "TeamLogo"] =
              logos[findCountryLogo(newPicks[pickIndex])];
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
            // this doesn't work for brackets with only 2 rounds (semi-final and final)
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
          newMatch[t + "TeamLogo"] = logos[findCountryLogo(teamToInsert)];
          newMatch[t + "TeamAbbreviation"] = getTeamAbbreviation(teamToInsert);
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
            newMatch[t + "TeamAbbreviation"] =
              getTeamAbbreviation(teamToInsert);
            newMatch[t + "TeamLogo"] = logos[findCountryLogo(teamToInsert)];
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

export const handlePopulateBracket = (
  groupPredictions,
  playoffPredictions,
  playoffMatches,
  result,
  isSecondChance
) => {
  let groups = {};
  groupPredictions.forEach((g) => {
    let thisGroup;
    if (result) {
      thisGroup = result.group.find((rg) => rg.groupName === g.groupName);
    }
    groups[g.groupName] = g.teamOrder.map((t, idx) => {
      let order = { name: t };
      if (thisGroup?.teamOrder[idx] === t) order.correct = true;
      return order;
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
    playoffMatch.homeTeamAbbreviation = getTeamAbbreviation(p.homeTeam);
    playoffMatch.homeTeamLogo = logos[findCountryLogo(p.homeTeam)];
    playoffMatch.awayTeamName = p.awayTeam;
    playoffMatch.awayTeamAbbreviation = getTeamAbbreviation(p.awayTeam);
    playoffMatch.awayTeamLogo = logos[findCountryLogo(p.awayTeam)];
    populatedPlayoffMatches.push(playoffMatch);
    if (result) {
      const thisRound = result.playoff.find((round) => round.round === p.round);
      if (thisRound) {
        playoffMatch.highlight = [];
        if (!isSecondChance || thisRound.round !== 1) {
          if (thisRound.teams.includes(p.homeTeam))
            playoffMatch.highlight.push("home");
          if (thisRound.teams.includes(p.awayTeam))
            playoffMatch.highlight.push("away");
        }
      }
    }
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

const checkForCompletion = (
  playoffPredictions,
  misc,
  competition,
  isSecondChance
) => {
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

  competition?.miscPicks?.forEach((pick) => {
    if (
      !misc[pick.name] ||
      misc[pick.name].toLowerCase().includes("winner") ||
      misc[pick.name].toLowerCase().includes("loser")
    ) {
      if (!isSecondChance || pick.name === "thirdPlace")
        missingItems.push({ label: "Bonus", text: pick.label });
    }
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
  let isSecondChance = state.isSecondChance;
  if (action.type === "save") {
    return {
      groups,
      playoffs,
      playoffMatches,
      misc,
      competition,
      isSaved: true,
      missingItems,
      isSecondChance,
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
      isSecondChance,
    };
  }
  if (action.type === "initial") {
    groups = action.groups;
    playoffs = action.playoffs;
    playoffMatches = action.playoffMatches.map((pm) => {
      return {
        ...pm,
        homeTeamAbbreviation: getTeamAbbreviation(pm.homeTeamName),
        awayTeamAbbreviation: getTeamAbbreviation(pm.awayTeamName),
      };
    });
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
        state.groups,
        competition
      );
    } else if (action.type === "reorder") {
      groups = handleReorder(
        action.selectedTeam,
        action.direction,
        action.groupName,
        state.groups,
        competition
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
    const updated = cascadeGroupChanges(
      groups,
      playoffMatches,
      misc,
      competition
    );
    playoffMatches = updated.playoffMatches;
    playoffs = updated.playoffs;
    misc = updated.misc;
  }
  missingItems = checkForCompletion(
    playoffs,
    misc,
    competition,
    state.isSecondChance
  );
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
    isSecondChance,
  };
}
