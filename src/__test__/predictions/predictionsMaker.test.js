import {
  apiResponse,
  changeText,
  clickByText,
  renderWithContext,
} from "../testHelpers";
import {
  addPredictionToGroup,
  getPrediction,
  savePrediction,
} from "../../services/predictionsService";
import { getCompetition } from "../../services/competitionService";
import { getMatches } from "../../services/matchService";
import { act, screen } from "@testing-library/react";
import PredictionMaker from "../../components/predictions/maker/predictionsMaker";
import { getGroups } from "../../services/groupsService";
import { competition, matches, user } from "../testData";
jest.mock("../../services/predictionsService", () => ({
  getPrediction: jest.fn(),
  savePrediction: jest.fn(),
  addPredictionToGroup: jest.fn(),
}));
jest.mock("../../services/competitionService", () => ({
  getCompetition: jest.fn(),
}));
jest.mock("../../services/matchService", () => ({
  getMatches: jest.fn(),
}));
jest.mock("../../services/groupsService", () => ({
  getGroups: jest.fn(),
}));

const renderWithProps = async (props = {}, mocks = {}, user = null) => {
  getPrediction.mockReturnValue(
    apiResponse(
      mocks?.getPrediction?.data || null,
      mocks?.getPrediction?.status || 200
    )
  );
  savePrediction.mockReturnValue(
    apiResponse(
      mocks?.savePrediction?.data || null,
      mocks?.savePrediction?.status || 200
    )
  );
  getCompetition.mockReturnValue(
    apiResponse(
      mocks?.getCompetition?.data || null,
      mocks?.getCompetition?.status || 200
    )
  );
  getMatches.mockReturnValue(
    apiResponse(mocks?.getMatches?.data || [], mocks?.getMatches?.status || 200)
  );
  addPredictionToGroup.mockReturnValue(
    apiResponse(null, mocks?.addPredictionToGroup?.status || 200)
  );
  getGroups.mockReturnValue(apiResponse(null, mocks?.getGroups?.status || 200));

  let mockReturns;
  await act(async () => {
    mockReturns = renderWithContext(PredictionMaker, props, user);
  });
  return mockReturns;
};

describe("PredictionsMaker", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Prediction Actions", () => {
    it("should render the basics with no error if no data returned", async () => {
      await renderWithProps();
      expect(screen.queryByText("Go Back")).toBeInTheDocument();
      expect(screen.queryByText("Name this Submission")).toBeInTheDocument();
      expect(screen.queryByText("See What's Missing")).toBeInTheDocument();
      expect(screen.queryByText("Prediction Saved")).toBeInTheDocument();
      expect(screen.queryByText("Group")).toBeInTheDocument();
      expect(screen.queryByText("Bracket")).toBeInTheDocument();
      expect(screen.queryByText("Bonus")).toBeInTheDocument();
      expect(screen.queryByText("Information")).toBeInTheDocument();
    });
    it("should offer to cancel when clicking go back if prediction is not saved", async () => {
      const { navMock } = await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: [] },
          savePrediction: { data: "savedID" },
        },
        user
      );
      changeText(/name this submission/i, "New Name");
      await clickByText(/go back/i);
      await clickByText("Cancel");
      expect(navMock).toHaveBeenCalledTimes(0);
    });
    it("should offer to go back without saving when clicking go back if prediction is not saved", async () => {
      const { navMock } = await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: [] },
          savePrediction: { data: "savedID" },
        },
        user
      );
      changeText(/name this submission/i, "New Name");
      await clickByText(/go back/i);
      await clickByText(/go back without saving/i);
      expect(savePrediction).toHaveBeenCalledTimes(0);
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith("/predictions?tab=submissions");
    });
    it("should offer to save then go back when clicking go back if prediction is not saved", async () => {
      const { navMock } = await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: [] },
          savePrediction: { data: "savedID" },
        },
        user
      );
      changeText(/name this submission/i, "New Name");
      await clickByText(/go back/i);
      await clickByText(/save and go back/i);
      expect(savePrediction).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledTimes(2);
      expect(navMock).toHaveBeenCalledWith("/predictions?tab=submissions");
    });
    it("should save the prediction when clicking the save button", async () => {
      const { navMock } = await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: [] },
          savePrediction: { data: "savedID" },
        },
        user
      );
      await clickByText(/Save Prediction/i);
      expect(savePrediction).toHaveBeenCalledTimes(1);
      expect(savePrediction).toHaveBeenCalledWith("new", {
        competitionID: "testBracket1", // ID from props
        groupPredictions: [],
        misc: { winner: "" },
        name: "Test's Bracket", // default name from user's name
        playoffPredictions: [],
      });
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/predictions?id=savedID&competitionID=testBracket1",
        { replace: true }
      );
    });
  });

  describe("Group Actions", () => {
    it("should open the group management popup", async () => {
      await renderWithProps(
        { predictionID: "xxx", competitionID: "testBracket1" },
        {
          getPrediction: { data: { name: "Test Bracket" } },
          getCompetition: { data: competition },
          getMatches: { data: [] },
          savePrediction: { data: "savedID" },
        },
        user
      );
      await clickByText("Add to Group");
      expect(
        screen.queryByText(/manage groups for test bracket/i)
      ).toBeInTheDocument();
    });
  });

  describe("Group Stage Tab", () => {
    it("should allow changing of team positions by arrow clicks", async () => {
      await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: matches },
          savePrediction: { data: "savedID" },
        },
        user
      );

      const startingOrder = [];
      const teamOrderRef = screen.queryAllByTestId("team_name");
      screen
        .queryAllByTestId("team_name")
        .forEach((el) => startingOrder.push(el.textContent));

      await clickByText("moveUp_icon", 0, true);
      expect(startingOrder[0]).toBe(teamOrderRef[1].textContent);
      expect(startingOrder[1]).toBe(teamOrderRef[0].textContent);

      await clickByText("moveDown_icon", 0, true);
      expect(startingOrder[0]).toBe(teamOrderRef[0].textContent);
    });
    it("should update teams in the bracket when changing group order", async () => {
      await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: matches },
          savePrediction: { data: "savedID" },
        },
        user
      );
      await clickByText("Bracket");
      expect(screen.queryAllByText("Team A").length).toBe(1);
      await clickByText("Group");
      await clickByText("moveDown_icon", 0, true);
      await clickByText("moveDown_icon", 1, true);
      await clickByText("Bracket");
      expect(screen.queryAllByText("Team A").length).toBe(0);
    });
    it("should open a modal with all matches for the group", async () => {
      await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: matches },
          savePrediction: { data: "savedID" },
        },
        user
      );
      await clickByText("See Matches");
      expect(screen.queryByText(`Group ${matches[0].groupName} Matches`));
      expect(screen.queryAllByText("Team A").length).toBe(3);
      expect(screen.queryAllByText("Team B").length).toBe(3);
      expect(screen.queryAllByText("Team C").length).toBe(3);
      expect(screen.queryAllByText("Team D").length).toBe(1);
      expect(screen.queryAllByText("Team E").length).toBe(1);
      expect(screen.queryAllByText("Team F").length).toBe(1);
      await clickByText("Close");
      await clickByText("See Matches", 1);
      expect(screen.queryByText(`Group ${matches[1].groupName} Matches`));
      expect(screen.queryAllByText("Team A").length).toBe(1);
      expect(screen.queryAllByText("Team B").length).toBe(1);
      expect(screen.queryAllByText("Team C").length).toBe(1);
      expect(screen.queryAllByText("Team D").length).toBe(3);
      expect(screen.queryAllByText("Team E").length).toBe(3);
      expect(screen.queryAllByText("Team F").length).toBe(3);
      await clickByText("Close");
    });
  });

  describe("Bracket Tab", () => {
    it("should move the clicked team to the next round", async () => {
      await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: matches },
          savePrediction: { data: "savedID" },
        },
        user
      );
      await clickByText("Bracket");
      expect(screen.queryAllByText("Team A").length).toBe(1);
      await clickByText("Team A");
      expect(screen.queryAllByText("Team A").length).toBe(2);
    });
    it("should select the champion when clicking a team in the final", async () => {
      await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: matches },
          savePrediction: { data: "savedID" },
        },
        user
      );
      await clickByText("Bracket");
      await clickByText("Team A");
      await clickByText("Team A", 1);
      expect(screen.queryAllByText("Team A").length).toBe(3);
      expect(screen.queryByTestId("bracket_winner").textContent).toBe("Team A");
    });
    it("should cascade a previous round pick through the whole bracket", async () => {
      await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: matches },
          savePrediction: { data: "savedID" },
        },
        user
      );
      await clickByText("Bracket");
      await clickByText("Team A");
      await clickByText("Team A", 1);
      await clickByText("Team E");
      expect(screen.queryByTestId("bracket_winner").textContent).toBe("Team E");
    });
  });

  describe("Bonus Tab", () => {
    it("should render the losing semi finalists as third place teams", async () => {
      await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: matches },
          savePrediction: { data: "savedID" },
        },
        user
      );
      // select teams A & B as semi final winners, sending D & E to third place
      await clickByText("Bracket");
      await clickByText("Team A");
      await clickByText("Team B");
      // view third place options
      await clickByText("Bonus");
      await clickByText("Third Place");
      expect(screen.queryByText("Team D")).toBeInTheDocument();
      expect(screen.queryByText("Team E")).toBeInTheDocument();
      // select Team D as winner, modal closes with Team D showing
      await clickByText("Team D");
      expect(screen.queryByText("Team D")).toBeInTheDocument();
      expect(screen.queryByText("Team E")).not.toBeInTheDocument();
    });
    it("should cascade a bracket change into the third place pick", async () => {
      await renderWithProps(
        { predictionID: "new", competitionID: "testBracket1" },
        {
          getCompetition: { data: competition },
          getMatches: { data: matches },
          savePrediction: { data: "savedID" },
        },
        user
      );
      // select teams A & B as semi final winners, sending D & E to third place
      await clickByText("Bracket");
      await clickByText("Team A");
      await clickByText("Team B");
      // select Team D as third place winner
      await clickByText("Bonus");
      await clickByText("Third Place");
      await clickByText("Team D");
      // edit the bracket so team D beats team B in semi final
      await clickByText("Bracket");
      await clickByText("Team D");
      // team B will now cascade into third place pick
      await clickByText("Bonus");
      expect(screen.queryByText("Team B")).toBeInTheDocument();
    });
  });
});
