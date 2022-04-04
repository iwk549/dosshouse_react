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
