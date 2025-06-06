import { screen, act } from "@testing-library/react";
import PredictionsRedirect from "../../components/predictions/predictionsRedirect";
import { mockHTMLContext } from "../mockHelpers";
import { apiResponse, renderWithContext } from "../testHelpers";
import {
  getLeaderboard,
  getPrediction,
  getPredictions,
} from "../../services/predictionsService";
import {
  getActiveCompetitions,
  getCompetition,
  getExpiredCompetitions,
} from "../../services/competitionService";
import { getMatches } from "../../services/matchService";
import { competition, leaderboard, matches } from "../testData";

jest.mock("../../services/predictionsService", () => ({
  getPrediction: jest.fn(),
  getPredictions: jest.fn(),
  getLeaderboard: jest.fn(),
}));
jest.mock("../../services/competitionService", () => ({
  getCompetition: jest.fn(),
  getActiveCompetitions: jest.fn(),
  getExpiredCompetitions: jest.fn(),
}));
jest.mock("../../services/matchService", () => ({
  getMatches: jest.fn(),
}));

// suppress error caused by long running dispatch op in maker component
jest.spyOn(console, "error").mockImplementation((msg) => {
  if (
    msg.includes("Can't perform a React state update on an unmounted component")
  ) {
    return;
  }
  console.error(msg);
});

const renderWithProps = async (path = "") => {
  getPrediction.mockReturnValue(apiResponse(null, 404));
  getPredictions.mockReturnValue(apiResponse([], 200));
  getActiveCompetitions.mockReturnValue(apiResponse([], 200));
  getExpiredCompetitions.mockReturnValue(apiResponse([], 200));
  getCompetition.mockReturnValue(apiResponse(competition));
  getMatches.mockReturnValue(apiResponse(matches));
  getLeaderboard.mockReturnValue(apiResponse(leaderboard));

  await act(async () => {
    renderWithContext(PredictionsRedirect, {}, null, path);
  });
};

describe("PredictionsRedirect", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockHTMLContext();
  });
  it("should render the predictions home page if there is no id", async () => {
    await renderWithProps();
    expect(
      screen.queryByText("There are currently no active competitions.")
    ).toBeInTheDocument();
  });
  it("should render the leaderboard if query param provided", async () => {
    await renderWithProps("?leaderboard=xx");
    expect(screen.queryByText("Sitewide Leaderboard")).toBeInTheDocument();
  });
  it("should render the prediction maker if id is in query params", async () => {
    await renderWithProps("?id=new");
    expect(
      screen.queryByText("This submission is not complete.")
    ).toBeInTheDocument();
  });
});
