export function submissionsMadeByCompetition(allPredictions) {
  let submissions = {};
  allPredictions.forEach((p) => {
    const compID = p.competitionID?._id || p.competitionID;
    if (submissions[compID]) {
      submissions[compID]++;
    } else submissions[compID] = 1;
  });
  return submissions;
}
