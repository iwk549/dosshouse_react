export default [
  {
    header: "Group Selection",
    body: <p>1 point for each correctly placed team</p>,
  },
  {
    header: "Playoff Bracket",
    body: (
      <p>
        2 points for each correct round of 16 team
        <br />
        4 points for each correct quarter final team
        <br />
        8 points for each correct semi final team
        <br />
        16 points for each correct finalist
        <br />
        <small>
          All playoff scoring disregards exact placement on the bracket
        </small>
      </p>
    ),
  },
  {
    header: "Champion",
    body: <p>32 points for picking the correct tournament champion</p>,
  },
];
