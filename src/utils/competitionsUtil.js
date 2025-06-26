export function submissionsMadeByCompetition(allPredictions) {
  let submissions = {};
  allPredictions.forEach((p) => {
    const compID = p.competitionID?._id || p.competitionID;
    const key = p.isSecondChance ? compID + "_sc" : compID;
    if (submissions[key]) {
      submissions[key]++;
    } else submissions[key] = 1;
  });
  return submissions;
}
