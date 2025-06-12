export function submissionsMadeByCompetition(allPredictions) {
  let submissions = {};
  allPredictions.forEach((p) => {
    if (submissions[p.competitionID?._id]) {
      submissions[p.competitionID?._id]++;
    } else submissions[p.competitionID?._id] = 1;
  });
  return submissions;
}
