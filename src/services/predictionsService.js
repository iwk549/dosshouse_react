import http from "./nodeHttpService";

export async function savePrediction(predictionID, predictions) {
  if (!predictionID || predictionID === "new")
    try {
      return await http.post(http.predictions, predictions);
    } catch (ex) {
      return ex.response;
    }
  else
    try {
      return await http.put(http.predictions + "/" + predictionID, predictions);
    } catch (ex) {
      return ex.response;
    }
}

export async function getPrediction(predictionID) {
  try {
    return await http.get(http.predictions + "/" + predictionID);
  } catch (ex) {
    return ex.response;
  }
}

export async function getPredictions() {
  try {
    return await http.get(http.predictions);
  } catch (ex) {
    return ex.response;
  }
}

export async function getPredictionsByCompetition(competitionID) {
  try {
    return await http.get(http.predictions + "/competitions/" + competitionID);
  } catch (ex) {
    return ex.response;
  }
}

export async function deletePrediction(predictionID) {
  try {
    return await http.delete(http.predictions + "/" + predictionID);
  } catch (ex) {
    return ex.response;
  }
}

export async function getLeaderboard(
  competitionID,
  pageNumber,
  resultsPerPage = 25,
  groupID = "all",
  isSecondChance = false
) {
  try {
    return await http.get(
      http.predictions +
        "/leaderboard/" +
        competitionID +
        "/" +
        resultsPerPage +
        "/" +
        pageNumber +
        "/" +
        groupID +
        `?secondChance=${isSecondChance}`
    );
  } catch (ex) {
    return ex.response;
  }
}

export async function searchLeaderboard(
  competitionID,
  groupID = "all",
  searchParam,
  isSecondChance
) {
  try {
    return await http.get(
      http.predictions +
        "/leaderboard/" +
        competitionID +
        "/" +
        groupID +
        "/" +
        searchParam +
        `?secondChance=${isSecondChance}`
    );
  } catch (ex) {
    return ex.response;
  }
}

export async function getUnownedPrediction(predictionID) {
  try {
    return await http.get(http.predictions + "/unowned/" + predictionID);
  } catch (ex) {
    return ex.response;
  }
}

export async function addPredictionToGroup(predictionID, group) {
  try {
    return await http.put(
      http.predictions + "/addtogroup/" + predictionID,
      group
    );
  } catch (ex) {
    return ex.response;
  }
}

export async function removePredictionFromGroup(predictionID, group) {
  try {
    return await http.put(
      http.predictions + "/removefromgroup/" + predictionID,
      group
    );
  } catch (ex) {
    return ex.response;
  }
}

export async function forceRemovePredictionFromGroup(predictionID, group) {
  try {
    return await http.put(
      http.predictions + "/forceremovefromgroup/" + predictionID,
      group
    );
  } catch (ex) {
    return ex.response;
  }
}

export async function getSubmissionsByMisc(competitionID, key, team) {
  try {
    return await http.get(
      http.predictions + "/bonus/" + competitionID + "/" + key + "/" + team
    );
  } catch (ex) {
    return ex.response;
  }
}
