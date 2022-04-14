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

export async function getLeaderboard(competitionID) {
  try {
    return await http.get(http.predictions + "/leaderboard/" + competitionID);
  } catch (ex) {
    return ex.response;
  }
}
