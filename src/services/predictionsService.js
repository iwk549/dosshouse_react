import http from "./nodeHttpService";

export async function savePredictions(predictionID, predictions) {
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
  groupID = "all"
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
        groupID
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
