export const getFinalRound = (bracket) => {
  return Math.max(...bracket.map((m) => m.round));
};
