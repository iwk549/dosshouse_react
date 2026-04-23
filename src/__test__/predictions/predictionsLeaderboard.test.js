import { apiResponse, clickByText, renderWithContext } from "../testHelpers"; // helpers must be imported at top of file as they contain mocking of useNavigate
import { act, screen } from "@testing-library/react";
import { getCompetition } from "../../services/competitionService";
import {
  getLeaderboard,
  searchLeaderboard,
  getUnownedPrediction,
  forceRemovePredictionFromGroup,
  getTeamEliminations,
} from "../../services/predictionsService";
import {
  competition,
  prediction,
  leaderboard,
  result,
  user,
} from "../testData";
import { getMatches } from "../../services/matchService";
import { getResult } from "../../services/resultsService";
import { getGroupLink } from "../../services/groupsService";
import PredictionsLeaderboard from "../../components/predictions/leaderboard/predictionsLeaderboard";
import { mockHTMLContext } from "../mockHelpers";
import { getTeamAbbreviation } from "../../utils/bracketsUtil";

jest.mock("../../services/groupsService", () => ({
  getGroupLink: jest.fn(),
}));
jest.mock("../../services/resultsService", () => ({
  getResult: jest.fn(),
}));
jest.mock("../../services/matchService", () => ({
  getMatches: jest.fn(),
}));
jest.mock("../../services/competitionService", () => ({
  getCompetition: jest.fn(),
}));
jest.mock("../../services/predictionsService", () => ({
  getLeaderboard: jest.fn(),
  searchLeaderboard: jest.fn(),
  getUnownedPrediction: jest.fn(),
  forceRemovePredictionFromGroup: jest.fn(),
  getTeamEliminations: jest.fn(),
}));

const renderWithProps = async (mocks = {}, props = {}, user = null) => {
  getGroupLink.mockReturnValue(
    apiResponse(
      mocks?.getGroupLink?.data || "link",
      mocks.getGroupLink?.status || 200,
    ),
  );
  getResult.mockReturnValue(
    apiResponse(
      mocks?.getResult?.data || result,
      mocks.getResult?.status || 200,
    ),
  );
  getMatches.mockReturnValue(
    apiResponse(mocks?.getMatches?.data || [], mocks.getMatches?.status || 200),
  );
  getCompetition.mockReturnValue(
    apiResponse(
      mocks?.getCompetition?.data || competition,
      mocks.getCompetition?.status || 200,
    ),
  );
  getLeaderboard.mockReturnValue(
    apiResponse(
      mocks?.getLeaderboard?.data || leaderboard,
      mocks.getLeaderboard?.status || 200,
    ),
  );
  searchLeaderboard.mockReturnValue(
    apiResponse(
      mocks?.searchLeaderboard?.data || [],
      mocks.searchLeaderboard?.status || 200,
    ),
  );
  getUnownedPrediction.mockReturnValue(
    apiResponse(
      mocks?.getUnownedPrediction?.data || {},
      mocks.getUnownedPrediction?.status || 200,
    ),
  );
  forceRemovePredictionFromGroup.mockReturnValue(
    apiResponse(
      mocks?.forceRemovePredictionFromGroup?.data || null,
      mocks.forceRemovePredictionFromGroup?.status || 200,
    ),
  );
  getTeamEliminations.mockReturnValue(
    apiResponse(
      mocks?.getTeamEliminations?.data || [],
      mocks.getTeamEliminations?.status || 200,
    ),
  );

  let mockReturns;
  await act(async () => {
    mockReturns = renderWithContext(PredictionsLeaderboard, props, user);
  });
  return mockReturns;
};

describe("PredictionsLeaderboard", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Sitewide Leaderboard", () => {
    it("should load an empty leaderboard", async () => {
      await renderWithProps({
        getLeaderboard: { data: { predictions: [], count: 0 } },
      });
      expect(screen.queryByText(/sitewide leaderboard/i)).toBeInTheDocument();
      expect(screen.queryByText(/no submissions/i)).toBeInTheDocument();
    });
    it("should hide champion picked if submission deadline has not passed", async () => {
      // misc prop containing winner info will not be returned from API if deadline has not passed
      await renderWithProps({
        getLeaderboard: {
          data: { predictions: [{ ...prediction, misc: null }], count: 1 },
        },
      });
      expect(screen.queryByText("Hidden")).toBeInTheDocument();
    });
    it("should not show prediction info when clicked if deadline has not passed", async () => {
      // check is against playoffPredictions to see if full submission was returned
      await renderWithProps({
        getLeaderboard: {
          data: {
            predictions: [
              { ...prediction, playoffPredictions: null, misc: null },
            ],
            count: 1,
          },
        },
      });
      await clickByText(prediction.name);
      expect(
        screen.queryByText(/you will be able to view all the picks/i),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/correct picks are highlighted/i),
      ).not.toBeInTheDocument();
    });
    it("should show the champion picked", async () => {
      await renderWithProps();
      expect(screen.queryByText(prediction.misc.winner)).toBeInTheDocument();
    });
  });

  describe("Group Leaderboards", () => {
    it("should render the group name", async () => {
      await renderWithProps({
        getLeaderboard: {
          data: {
            predictions: [],
            count: 0,
            groupInfo: { name: "Test Group" },
          },
        },
      });
      expect(screen.queryByText("Test Group Leaderboard")).toBeInTheDocument();
    });
    it("should not show the invite or remove buttons to a non owner", async () => {
      await renderWithProps({
        getLeaderboard: {
          data: {
            predictions: [],
            count: 0,
            groupInfo: { name: "Test Group" },
          },
        },
      });
      expect(screen.queryByText("Invite Users")).not.toBeInTheDocument();
      expect(screen.queryByTestId("remove_icon")).not.toBeInTheDocument();
    });
    it("should copy the invite link to the clipboard", async () => {
      const { writeToClipboardMock } = mockHTMLContext();
      await renderWithProps(
        {
          getLeaderboard: {
            data: {
              predictions: [],
              count: 0,
              groupInfo: { name: "Test Group", ownerID: { _id: user._id } },
            },
          },
          getGroupLink: { data: { link: "testlink" } },
        },
        {},
        user,
      );
      await clickByText("Invite Users");
      await clickByText(/copy invite link/i);
      expect(writeToClipboardMock).toHaveBeenCalledTimes(1);
      expect(writeToClipboardMock).toHaveBeenCalledWith(
        expect.stringContaining("testlink"),
      );
    });
    it("should allow removing a prediction from the group", async () => {
      const groupInfo = { name: "Test Group", ownerID: { _id: user._id } };
      await renderWithProps(
        {
          getLeaderboard: {
            data: {
              predictions: [prediction],
              count: 0,
              groupInfo,
            },
          },
        },
        {},
        user,
      );
      await clickByText("remove_icon", 0, true);
      await clickByText("OK");
      expect(forceRemovePredictionFromGroup).toHaveBeenCalledTimes(1);
      expect(forceRemovePredictionFromGroup).toHaveBeenCalledWith(
        prediction._id,
        groupInfo,
      );
    });
  });

  describe("Team Eliminations", () => {
    const pastDeadlineCompetition = {
      ...competition,
      submissionDeadline: "2020-01-01T00:00:00.000Z",
    };
    // Real country names required — teams without a logo entry are filtered out
    const teamMatches = [
      { type: "Group", homeTeamName: "Argentina", awayTeamName: "Brazil" },
      { type: "Playoff", homeTeamName: "Argentina", awayTeamName: "Brazil" },
    ];
    const eliminationsData = [
      {
        _id: "e1",
        name: "My Picks",
        userID: { name: "Alice" },
        totalPoints: 42,
        eliminationRound: "Semi Final",
      },
      {
        _id: "e2",
        name: "Her Picks",
        userID: { name: "Bob" },
        totalPoints: 38,
        eliminationRound: "Semi Final",
      },
      {
        _id: "e3",
        name: "His Picks",
        userID: { name: "Carol" },
        totalPoints: 20,
        eliminationRound: "Quarter Final",
      },
    ];

    it("should not show the button before the submission deadline", async () => {
      await renderWithProps({
        getMatches: { data: teamMatches },
      });
      expect(
        screen.queryByText("View Team Eliminations"),
      ).not.toBeInTheDocument();
    });

    it("should show the button after the submission deadline", async () => {
      await renderWithProps({
        getCompetition: { data: pastDeadlineCompetition },
        getMatches: { data: teamMatches },
      });
      expect(
        screen.queryByText("View Team Eliminations"),
      ).toBeInTheDocument();
    });

    it("should open the team picker when the button is clicked", async () => {
      await renderWithProps({
        getCompetition: { data: pastDeadlineCompetition },
        getMatches: { data: teamMatches },
      });
      await clickByText("View Team Eliminations");
      expect(screen.queryByText("Argentina")).toBeInTheDocument();
      expect(screen.queryByText("Brazil")).toBeInTheDocument();
    });

    it("should fetch eliminations and show the round breakdown when a team is selected", async () => {
      await renderWithProps(
        {
          getCompetition: { data: pastDeadlineCompetition },
          getMatches: { data: teamMatches },
          getTeamEliminations: { data: eliminationsData },
        },
        { competitionID: pastDeadlineCompetition._id, groupID: "all" },
      );
      await clickByText("View Team Eliminations");
      await clickByText("Argentina");
      expect(getTeamEliminations).toHaveBeenCalledTimes(1);
      expect(getTeamEliminations).toHaveBeenCalledWith(
        pastDeadlineCompetition._id,
        "all",
        "Argentina",
        undefined,
      );
      expect(screen.queryByText("Semi Final")).toBeInTheDocument();
      expect(screen.queryByText("Quarter Final")).toBeInTheDocument();
    });

    it("should expand submissions when a round row is clicked", async () => {
      await renderWithProps(
        {
          getCompetition: { data: pastDeadlineCompetition },
          getMatches: { data: teamMatches },
          getTeamEliminations: { data: eliminationsData },
        },
        { competitionID: pastDeadlineCompetition._id, groupID: "all" },
      );
      await clickByText("View Team Eliminations");
      await clickByText("Argentina");
      expect(screen.queryByText("My Picks")).not.toBeInTheDocument();
      await clickByText("Semi Final");
      expect(screen.queryByText("My Picks")).toBeInTheDocument();
      expect(screen.queryByText("Her Picks")).toBeInTheDocument();
      expect(screen.queryByText("His Picks")).not.toBeInTheDocument();
    });

    it("should collapse submissions when the same round row is clicked again", async () => {
      await renderWithProps(
        {
          getCompetition: { data: pastDeadlineCompetition },
          getMatches: { data: teamMatches },
          getTeamEliminations: { data: eliminationsData },
        },
        { competitionID: pastDeadlineCompetition._id, groupID: "all" },
      );
      await clickByText("View Team Eliminations");
      await clickByText("Argentina");
      await clickByText("Semi Final");
      expect(screen.queryByText("My Picks")).toBeInTheDocument();
      await clickByText("Semi Final");
      expect(screen.queryByText("My Picks")).not.toBeInTheDocument();
    });
  });

  describe("Mobile View", () => {
    beforeEach(() => {
      mockHTMLContext("/", 300);
    });
    it("should show the champion picked", async () => {
      await renderWithProps();
      expect(
        screen.queryByText(getTeamAbbreviation(prediction.misc.winner)),
      ).toBeInTheDocument();
    });
  });
});
