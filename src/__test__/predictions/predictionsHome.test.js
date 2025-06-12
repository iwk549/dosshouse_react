import { apiResponse, clickByText, renderWithContext } from "../testHelpers"; // helpers must be imported at top of file as they contain mocking of useNavigate
import { act, screen } from "@testing-library/react";
import PredictionsHome from "../../components/predictions/home/predictionsHome";
import {
  getActiveCompetitions,
  getExpiredCompetitions,
} from "../../services/competitionService";
import {
  getPredictions,
  addPredictionToGroup,
  getPredictionsByCompetition,
} from "../../services/predictionsService";
import { competition, prediction } from "../testData";
import { longDate } from "../../utils/allowables";

jest.mock("../../services/competitionService", () => ({
  getActiveCompetitions: jest.fn(),
  getExpiredCompetitions: jest.fn(),
}));
jest.mock("../../services/predictionsService", () => ({
  getPredictions: jest.fn(),
  addPredictionToGroup: jest.fn(),
  getPredictionsByCompetition: jest.fn(),
}));

const renderWithProps = async (mocks = {}, props = {}, user = null) => {
  getActiveCompetitions.mockReturnValue(
    apiResponse(
      mocks?.getActiveCompetitions?.data || [],
      mocks.getActiveCompetitions?.status || 200
    )
  );
  getExpiredCompetitions.mockReturnValue(
    apiResponse(
      mocks?.getExpiredCompetitions?.data || [],
      mocks.getExpiredCompetitions?.status || 200
    )
  );
  getPredictions.mockReturnValue(
    apiResponse(
      mocks?.getPredictions?.data || [],
      mocks.getPredictions?.status || 200
    )
  );
  getPredictionsByCompetition.mockReturnValue(
    apiResponse(
      mocks?.getPredictionsByCompetition?.data || [],
      mocks.getPredictionsByCompetition?.status || 200
    )
  );
  addPredictionToGroup.mockReturnValue(
    apiResponse(
      mocks?.addPredictionToGroup?.data || null,
      mocks.addPredictionToGroup?.status || 200
    )
  );

  let mockReturns;
  await act(async () => {
    mockReturns = renderWithContext(PredictionsHome, props, user);
  });
  return mockReturns;
};

describe("PredictionsHome", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Active Competitions", () => {
    it("should render default text with no competitions", async () => {
      await renderWithProps();
      expect(
        screen.queryByText(/currently no active competitions/i)
      ).toBeInTheDocument();
      await clickByText("Expired");
      expect(
        screen.queryByText(/no expired competitions/i)
      ).toBeInTheDocument();
    });
    it("should render the competition info and default buttons", async () => {
      await renderWithProps({ getActiveCompetitions: { data: [competition] } });

      // competition info
      expect(screen.queryByText(/submission deadline/i)).toBeInTheDocument();
      expect(screen.queryByText(/submissions made/i)).toBeInTheDocument();
      expect(screen.queryByText(/submissions allowed/i)).toBeInTheDocument();
      expect(screen.queryByText(/competition start/i)).toBeInTheDocument();
      expect(screen.queryByText(/competition end/i)).toBeInTheDocument();
      expect(screen.queryByTestId("made").textContent).toBe("0");
      expect(screen.queryByTestId("allowed").textContent).toBe(
        String(competition.maxSubmissions)
      );
      expect(screen.queryByTestId("deadline").textContent).toBe(
        longDate(competition.submissionDeadline)
      );
      expect(screen.queryByTestId("start").textContent).toBe(
        longDate(competition.competitionStart)
      );
      expect(screen.queryByTestId("end").textContent).toBe(
        longDate(competition.competitionEnd)
      );

      // buttons
      expect(screen.queryByText("View Submissions")).not.toBeInTheDocument();
      expect(screen.queryByText("Start New Submission")).toBeInTheDocument();
      expect(screen.queryByText("View Leaderboard")).toBeInTheDocument();
    });
    it("should NOT show the start new submission button if the submission deadline has passed", async () => {
      await renderWithProps({
        getActiveCompetitions: {
          data: [{ ...competition, submissionDeadline: new Date() }],
        },
      });

      expect(
        screen.queryByText("Start New Submission")
      ).not.toBeInTheDocument();
    });
    it("should show the submissions made and BOT render the new submission button", async () => {
      await renderWithProps({
        getActiveCompetitions: { data: [competition] },
        getPredictions: {
          data: [{ ...prediction, competitionID: competition._id }],
        },
      });

      expect(screen.queryByTestId("made").textContent).toBe("1");
      expect(screen.queryByText("View Submissions")).toBeInTheDocument();
      expect(
        screen.queryByText("Start New Submission")
      ).not.toBeInTheDocument();
    });
    it("should navigate to the leaderboard", async () => {
      const { navMock } = await renderWithProps({
        getActiveCompetitions: { data: [competition] },
      });

      await clickByText("View Leaderboard");
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/competitions?leaderboard=show&competitionID=" +
          competition._id +
          "&groupID=all"
      );
    });
    it("should navigate to a new submission", async () => {
      const { navMock } = await renderWithProps({
        getActiveCompetitions: { data: [competition] },
      });

      await clickByText("Start New Submission");
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/submissions?id=new&competitionID=" + competition._id
      );
    });
    it("should navigate to view existing submissions", async () => {
      const { navMock } = await renderWithProps({
        getActiveCompetitions: { data: [competition] },
        getPredictions: {
          data: [{ ...prediction, competitionID: competition._id }],
        },
      });

      await clickByText("View Submissions");
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/submissions?competitionID=" + competition._id
      );
    });
  });

  describe("Expired Competitions", () => {
    it("should NOT display New/Edit Submission buttons", async () => {
      await renderWithProps(
        {
          getExpiredCompetitions: {
            data: [
              {
                ...competition,
              },
            ],
          },
        },
        { paramTab: "Expired" }
      );

      expect(
        screen.queryByText("Start New Submission")
      ).not.toBeInTheDocument();
    });
    it("should navigate to view existing submissions", async () => {
      const { navMock } = await renderWithProps(
        {
          getExpiredCompetitions: { data: [competition] },
          getPredictions: {
            data: [{ ...prediction, competitionID: competition._id }],
          },
        },
        { paramTab: "Expired" }
      );

      await clickByText("View Submissions");
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/submissions?competitionID=" + competition._id
      );
    });
  });

  describe("Adding Prediction to Group", () => {
    it("should prompt the user to log in to view their existing predictions", async () => {
      await renderWithProps(
        {
          getActiveCompetitions: { data: [competition] },
        },
        {
          type: "groupLink",
          groupName: "Test Group",
          groupPasscode: "Password1",
          competitionID: competition._id,
        }
      );

      await clickByText(/don't see your predictions/i);
      expect(
        screen.queryByText(/login to add your submission/i)
      ).toBeInTheDocument();
    });
    it("should allow starting a new submission to join the group", async () => {
      const { navMock } = await renderWithProps(
        {
          getActiveCompetitions: { data: [competition] },
        },
        {
          type: "groupLink",
          groupName: "Test Group",
          groupPasscode: "Password1",
          competitionID: competition._id,
        },
        {}
      );

      await clickByText("Create New Submission");
      await clickByText("Start a New Submission");
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/submissions?id=new&competitionID=" +
          competition._id +
          "&groupName=Test Group" +
          "&groupPasscode=Password1"
      );
    });
    it("should allow adding a prediction to a group", async () => {
      const { navMock } = await renderWithProps(
        {
          getActiveCompetitions: { data: [competition] },
          getPredictionsByCompetition: {
            data: [{ ...prediction, competitionID: competition._id }],
          },
          addPredictionToGroup: { data: "new_id" },
        },
        {
          type: "groupLink",
          groupName: "Test Group",
          groupPasscode: "Password1",
          competitionID: competition._id,
        },
        {}
      );

      expect(
        screen.queryByText(/you've been invited to join a group/i)
      ).toBeInTheDocument();
      await clickByText(prediction.name);
      await clickByText("Add Selected Submission to Group");
      expect(addPredictionToGroup).toHaveBeenCalledTimes(1);
      expect(addPredictionToGroup).toHaveBeenCalledWith(prediction._id, {
        name: "Test Group",
        passcode: "Password1",
      });
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/competitions?leaderboard=show&competitionID=" +
          competition._id +
          "&groupID=" +
          "new_id"
      );
    });
  });
});
