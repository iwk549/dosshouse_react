export default [
  {
    header: "Gambling/Wagering Disclaimer",
    body: (
      <p>
        The bracket competition and leaderboards are for use in friendly
        competitions only. This website does not accept, facilitate, or condone
        any real money wagers or pools.
      </p>
    ),
  },
  {
    header: "Bracket Validation",
    body: (
      <p>
        A bracket must be theoretically possible to occur in real life to be
        valid. For example: if you pick a team as your champion but did not pick
        that team to participate in the final, or if you place a team in the
        playoff bracket that you picked to finish last in their group your
        bracket is invalid.
        <br />
        <br />
        A bracket that has not been completely filled out (i.e. one or more
        teams in the playoff bracket are still listed as "Winner", or all bonus
        picks have not been selected) is considered to be a valid bracket. No
        points will be awarded for the missing items, but it will still be in
        contention for the leaderboard.
        <br />
        <br />
        Brackets are only checked for validity during the scoring portion at
        which point it will be too late to amend your bracket. If submitting a
        custom bracket to our open API you must check it for validitiy yourself.
        Invalid brackets are not eligible for the leaderboard and are subject to
        disqualification.
      </p>
    ),
  },
  {
    header: "Top Goalscorer",
    body: (
      <p>
        If there is an official golden boot (or similar award for top
        goalscorer) handed out by the tournament then the winner will be based
        of off that, with any tiebreakers coming from those official rules.
        <br />
        If there is no official award then only goals scored will be counted, no
        tiebreakers will be applied. In the case of a tie all submissions
        picking any of the correct teams will be awarded full points.
      </p>
    ),
  },
  {
    header: "Worst Discipline",
    body: (
      <p>
        For soccer brackets a worst discipline bonus pick may be implemented.
        This will be calculated using a points system. 1 point will be awarded
        for each yellow card the team receives, 2 points for each red card. Only
        cards awarded to players will count towards this total. Any cards given
        to coaching staff or disciplinary action taken against unruly fans will
        not be considered.
        <br />
        In the case a a tie on points the team with the most red cards will be
        considered to have the worst discipline. If it is still tied then all
        submissions which picked any of the tied teams will be awarded full
        points.
      </p>
    ),
  },
];
