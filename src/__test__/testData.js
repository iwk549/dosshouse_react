const competition = {
  _id: { $oid: "6252ebe1d595c7d6a7a76ded" },
  code: "testBracket1",
  name: "World Cup 2022",
  submissionDeadline: { $date: "2022-11-20T15:00:00.000Z" },
  maxSubmissions: 2,
  competitionStart: { $date: "2022-11-20T16:00:00.000Z" },
  competitionEnd: { $date: "2022-12-18T18:00:00.000Z" },
  scoring: {
    group: {
      perTeam: 1,
      bonus: 1,
    },
    playoff: [
      {
        roundName: "Round of 16",
        roundNumber: 1,
        points: 2,
      },
      {
        roundName: "Quarter Final",
        roundNumber: 2,
        points: 4,
      },
      {
        roundName: "Semi Final",
        roundNumber: 3,
        points: 8,
      },
      {
        roundName: "Final",
        roundNumber: 4,
        points: 16,
      },
    ],
    champion: 32,
  },
  miscPicks: [
    {
      name: "thirdPlace",
      label: "Third Place",
      description: "Winner of the third place playoff",
      points: 16,
      info: {
        homeTeamGoals: 0,
        homeTeamPKs: 0,
        awayTeamGoals: 0,
        awayTeamPKs: 0,
        matchAccepted: false,
        homeTeamName: "Loser Match 7",
        awayTeamName: "Loser Match 8",
        matchNumber: 9,
        round: 1001,
        sport: "Soccer",
        type: "Playoff",
        getTeamsFrom: {
          home: {
            matchNumber: 7,
          },
          away: {
            matchNumber: 8,
          },
        },
      },
    },
    {
      name: "discipline",
      label: "Worst Discipline",
      description:
        "Team with the worst disciplinary record at the end of the tournament (most yellow and red cards).",
      points: 10,
    },
    {
      name: "topScorer",
      label: "Top Goalscorer",
      description:
        "Team with the player who wins the golden boot for most goals in the tournament",
      points: 10,
    },
  ],
  prize: {
    text: "One free year of ultimatescoreboard.com Ultimate level subscription.",
    link: "https://ultimatescoreboard.com",
  },
};

const matches = [
  {
    homeTeamGoals: null,
    awayTeamGoals: null,
    matchAccepted: false,
    homeTeamName: "Team A",
    awayTeamName: "Team B",
    matchNumber: 1,
    round: 1,
    sport: "Soccer",
    type: "Group",
    groupName: "Group A",
    bracketCode: "testBracket1",
  },
  {
    homeTeamGoals: null,
    awayTeamGoals: null,
    matchAccepted: false,
    homeTeamName: "Team A",
    awayTeamName: "Team C",
    matchNumber: 2,
    round: 1,
    sport: "Soccer",
    type: "Group",
    groupName: "Group A",
    bracketCode: "testBracket1",
  },
  {
    homeTeamGoals: null,
    awayTeamGoals: null,
    matchAccepted: false,
    homeTeamName: "Team B",
    awayTeamName: "Team C",
    matchNumber: 3,
    round: 1,
    sport: "Soccer",
    type: "Group",
    groupName: "Group A",
    bracketCode: "testBracket1",
  },
  {
    homeTeamGoals: null,
    awayTeamGoals: null,
    matchAccepted: false,
    homeTeamName: "Team D",
    awayTeamName: "Team E",
    matchNumber: 4,
    round: 1,
    sport: "Soccer",
    type: "Group",
    groupName: "Group B",
    bracketCode: "testBracket1",
  },
  {
    homeTeamGoals: null,
    awayTeamGoals: null,
    matchAccepted: false,
    homeTeamName: "Team D",
    awayTeamName: "Team F",
    matchNumber: 5,
    round: 1,
    sport: "Soccer",
    type: "Group",
    groupName: "Group B",
    bracketCode: "testBracket1",
  },
  {
    homeTeamGoals: null,
    awayTeamGoals: null,
    matchAccepted: false,
    homeTeamName: "Team E",
    awayTeamName: "Team F",
    matchNumber: 6,
    round: 1,
    sport: "Soccer",
    type: "Group",
    groupName: "Group B",
    bracketCode: "testBracket1",
  },
  {
    homeTeamGoals: 0,
    homeTeamPKs: 0,
    awayTeamGoals: 0,
    awayTeamPKs: 0,
    matchAccepted: false,
    homeTeamName: "Winner Group A",
    awayTeamName: "Runner Up Group B",
    dateTime: { $date: "2022-12-18T15:00:00.000Z" },
    location: "Lusail Stadium",
    matchNumber: 7,
    round: 1,
    sport: "Soccer",
    type: "Playoff",
    getTeamsFrom: {
      home: {
        groupName: "Group A",
        position: 1,
      },
      away: {
        groupName: "Group B",
        position: 2,
      },
    },
    bracketCode: "testBracket1",
  },
  {
    homeTeamGoals: 0,
    homeTeamPKs: 0,
    awayTeamGoals: 0,
    awayTeamPKs: 0,
    matchAccepted: false,
    homeTeamName: "Winner Group B",
    awayTeamName: "Runner Up Group A",
    dateTime: { $date: "2022-12-18T15:00:00.000Z" },
    location: "Lusail Stadium",
    matchNumber: 8,
    round: 1,
    sport: "Soccer",
    type: "Playoff",
    getTeamsFrom: {
      home: {
        groupName: "Group B",
        position: 1,
      },
      away: {
        groupName: "Group A",
        position: 2,
      },
    },
    bracketCode: "testBracket1",
  },
  {
    homeTeamGoals: 0,
    homeTeamPKs: 0,
    awayTeamGoals: 0,
    awayTeamPKs: 0,
    matchAccepted: false,
    homeTeamName: "Winner 7",
    awayTeamName: "Winner 8",
    matchNumber: 10,
    round: 2,
    sport: "Soccer",
    type: "Playoff",
    getTeamsFrom: {
      home: {
        matchNumber: 7,
      },
      away: {
        matchNumber: 8,
      },
    },
    bracketCode: "testBracket1",
  },
];

const prediction = {
  name: "Test Bracket",
  competitionID: "testBracket1",
  groupPredictions: [
    { groupName: "Group A", teamOrder: ["Team C", "Team A", "Team B"] },
    { groupName: "Group B", teamOrder: ["Team F", "Team D", "Team E"] },
  ],
  playoffPredictions: [
    { matchNumber: 7, homeTeam: "Team C", awayTeam: "Team D", round: 1 },
    { matchNumber: 8, homeTeam: "Team F", awayTeam: "Team A", round: 1 },
    { matchNumber: 9, homeTeam: "Team D", awayTeam: "Team F", round: 2 },
  ],
  misc: { winner: "Team D" },
};

const leaderboard = {
  predictions: [prediction],
  count: 0,
};

const user = {
  _id: "abcd",
  name: "Test User",
  email: "test@test.com",
};

export { competition, matches, prediction, leaderboard, user };
