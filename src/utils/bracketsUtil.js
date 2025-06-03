import { findCountryLogo } from "./predictionsUtil";

export const getFinalRound = (bracket) => {
  return Math.max(...bracket.map((m) => m.round));
};

export const getTeamAbbreviation = (teamName) => {
  const preAbr = findCountryLogo(teamName);
  let lcName = preAbr.toLowerCase();
  let splitName = lcName.split(" ");

  // basic return value, 3 chars upper
  let abbreviation = teamName.slice(0, 3).toUpperCase();

  if ((splitName[1] && lcName.includes("winner")) || lcName.includes("loser")) {
    // if the team is a winner or loser, WIN/LOS + the match number
    abbreviation = (lcName.slice(0, 3) + " " + splitName[1]).toUpperCase();
  } else if (lcName.split(" ")[1]) {
    // if team has two or more words in name use first char from each
    abbreviation = "";
    splitName.forEach((word) => {
      abbreviation += word.charAt(0).toUpperCase();
    });
  }
  return abbreviation;
};
