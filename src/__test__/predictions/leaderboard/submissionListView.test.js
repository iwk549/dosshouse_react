import { act, screen } from "@testing-library/react";
import { renderWithContext, clickByText } from "../../testHelpers";
import SubmissionListView from "../../../components/predictions/maker/submissionListView";

const baseCompetition = {
  scoring: {
    group: { perTeam: 1, bonus: 2 },
    playoff: [
      { roundName: "Quarter Final", roundNumber: 1, points: 4 },
      { roundName: "Final", roundNumber: 2, points: 16 },
    ],
    champion: 32,
  },
  miscPicks: [{ name: "topScorer", label: "Top Scorer", points: 10 }],
};

const buildGroups = () => ({
  A: [
    { name: "USA", correct: true },
    { name: "Mexico", correct: true },
  ],
  B: [
    { name: "Brazil", correct: false },
    { name: "Argentina", correct: false },
  ],
});

const defaultPlayoffMatches = [
  {
    round: 1,
    homeTeamName: "USA",
    awayTeamName: "Mexico",
    highlight: ["home"],
  },
  {
    round: 2,
    homeTeamName: "USA",
    awayTeamName: "Brazil",
    highlight: [],
  },
];

const renderView = async (props = {}) => {
  await act(async () => {
    renderWithContext(SubmissionListView, {
      groups: buildGroups(),
      playoffMatches: defaultPlayoffMatches,
      misc: { winner: "USA", topScorer: "Messi" },
      result: undefined,
      competition: baseCompetition,
      ...props,
    });
  });
};

const dotsByClass = (className) =>
  document.body.querySelectorAll(`.group-pick-dot.${className}`);

const allDots = () => document.body.querySelectorAll(".group-pick-dot");

describe("SubmissionListView", () => {
  describe("section headers", () => {
    it("renders Groups header when groups are present", async () => {
      await renderView();
      expect(screen.queryByText("Groups")).toBeInTheDocument();
    });

    it("renders Playoffs header when playoff rounds are present", async () => {
      await renderView();
      expect(screen.queryByText("Playoffs")).toBeInTheDocument();
    });

    it("renders Bonus header when miscPicks have user values", async () => {
      await renderView();
      expect(screen.queryByText("Bonus")).toBeInTheDocument();
    });

    it("does not render Bonus header when no miscPicks have user values", async () => {
      await renderView({ misc: { winner: "USA" } });
      expect(screen.queryByText("Bonus")).not.toBeInTheDocument();
    });
  });

  describe("Summary/Detail toggle", () => {
    it("defaults to Summary mode (active pill)", async () => {
      await renderView();
      expect(screen.getByText("Summary").className).toContain("active");
      expect(screen.getByText("Detail").className).not.toContain("active");
    });

    it("switches to Detail mode when Detail pill is clicked", async () => {
      await renderView();
      await clickByText("Detail");
      expect(screen.getByText("Detail").className).toContain("active");
      expect(screen.getByText("Summary").className).not.toContain("active");
    });

    it("renders the playoff round header pill in Detail mode", async () => {
      await renderView();
      await clickByText("Detail");
      // .playoff-round-header pill is rendered for each round only in Detail
      const headers = document.body.querySelectorAll(".playoff-round-header");
      expect(headers.length).toBeGreaterThan(0);
    });
  });

  describe("group summary dots", () => {
    it("does not render dots when there is no result", async () => {
      await renderView({ result: undefined, playoffMatches: [], misc: {} });
      expect(allDots()).toHaveLength(0);
    });

    it("renders one dot per group team when result exists", async () => {
      await renderView({
        playoffMatches: [],
        misc: {},
        result: {
          group: [
            { groupName: "A", teamOrder: ["USA", "Mexico"] },
            { groupName: "B", teamOrder: ["Argentina", "Brazil"] },
          ],
          playoff: [],
          misc: {},
        },
      });
      // 2 groups × 2 teams = 4 dots
      expect(allDots()).toHaveLength(4);
    });

    it("marks group dots as pending when result has no entry for that group", async () => {
      await renderView({
        playoffMatches: [],
        misc: {},
        result: {
          group: [{ groupName: "A", teamOrder: ["USA", "Mexico"] }],
          playoff: [],
          misc: {},
        },
      });
      expect(dotsByClass("pending")).toHaveLength(2); // group B (unscored)
      expect(dotsByClass("correct")).toHaveLength(2); // group A teams
    });

    it("uses matrix.name as the label for matrix groups", async () => {
      const groupsWithMatrix = {
        ...buildGroups(),
        thirdPlaceKey: [{ name: "A: Brazil", correct: false }],
      };
      const competitionWithMatrix = {
        ...baseCompetition,
        groupMatrix: [
          { key: "thirdPlaceKey", name: "Third Place Ranking" },
        ],
      };
      await renderView({
        groups: groupsWithMatrix,
        competition: competitionWithMatrix,
      });
      expect(screen.queryByText("Third Place Ranking")).toBeInTheDocument();
      expect(screen.queryByText("thirdPlaceKey")).not.toBeInTheDocument();
    });
  });

  describe("playoff summary pending state", () => {
    it("marks all picks pending when round is not in result.playoff", async () => {
      await renderView({
        groups: {},
        playoffMatches: [
          {
            round: 1,
            homeTeamName: "USA",
            awayTeamName: "Mexico",
            // no highlight: round not present in result.playoff
          },
        ],
        misc: { winner: "USA" },
        result: { group: [], playoff: [], misc: {} },
      });
      expect(dotsByClass("pending").length).toBeGreaterThanOrEqual(2);
      expect(dotsByClass("correct")).toHaveLength(0);
    });

    it("keeps correct picks green and unverified picks pending in a partially-filled round", async () => {
      // Final has 1 match (2 slots). Result has only USA filled.
      await renderView({
        groups: {},
        playoffMatches: [
          {
            round: 2,
            homeTeamName: "USA",
            awayTeamName: "Brazil",
            highlight: ["home"], // home verified-correct
          },
        ],
        misc: { winner: "USA" },
        result: {
          group: [],
          playoff: [{ round: 2, teams: ["USA", ""] }],
          misc: {},
        },
      });
      // USA dot stays correct; Brazil dot is pending (not incorrect/red)
      expect(dotsByClass("correct").length).toBeGreaterThanOrEqual(1);
      expect(dotsByClass("pending").length).toBeGreaterThanOrEqual(1);
    });

    it("does not show the round points badge when all picks are pending", async () => {
      await renderView({
        groups: {},
        playoffMatches: [
          { round: 1, homeTeamName: "USA", awayTeamName: "Mexico" },
        ],
        misc: { winner: "USA" },
        result: { group: [], playoff: [], misc: {} },
      });
      expect(screen.queryByText(/^0\s*pts$/)).not.toBeInTheDocument();
    });

    it("renders a Champion row in the playoff summary", async () => {
      await renderView();
      expect(screen.queryByText("Champion")).toBeInTheDocument();
    });
  });

  describe("bonus pending state", () => {
    it("marks the misc dot pending when result.misc has no value for the pick", async () => {
      await renderView({
        groups: {},
        playoffMatches: [],
        misc: { topScorer: "Messi" },
        result: { group: [], playoff: [], misc: {} },
      });
      expect(dotsByClass("pending")).toHaveLength(1);
    });

    it("marks the misc dot correct when result.misc value matches user pick", async () => {
      await renderView({
        groups: {},
        playoffMatches: [],
        misc: { topScorer: "Messi" },
        result: { group: [], playoff: [], misc: { topScorer: "Messi" } },
      });
      expect(dotsByClass("correct")).toHaveLength(1);
    });

    it("hides the bonus points badge when the misc pick is pending", async () => {
      await renderView({
        groups: {},
        playoffMatches: [],
        misc: { topScorer: "Messi" },
        result: { group: [], playoff: [], misc: {} },
      });
      expect(screen.queryByText(/10\s*pts/)).not.toBeInTheDocument();
    });
  });
});
