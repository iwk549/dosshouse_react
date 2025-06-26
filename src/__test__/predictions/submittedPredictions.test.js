import { apiResponse, clickByText, renderWithContext } from "../testHelpers"; // helpers must be imported at top of file as they contain mocking of useNavigate
import { act, screen } from "@testing-library/react";

import {
  getPredictions,
  deletePrediction,
  removePredictionFromGroup,
} from "../../services/predictionsService";
import SubmittedPredictions from "../../components/predictions/home/submittedPredictions";
import { competition, prediction } from "../testData";

jest.mock("../../services/predictionsService", () => ({
  getPredictions: jest.fn(),
  deletePrediction: jest.fn(),
  removePredictionFromGroup: jest.fn(),
}));

const renderWithProps = async (mocks = {}, props = {}, user = {}) => {
  getPredictions.mockReturnValue(
    apiResponse(
      mocks?.getPredictions?.data || [],
      mocks.getPredictions?.status || 200
    )
  );
  deletePrediction.mockReturnValue(
    apiResponse(
      mocks?.deletePrediction?.data || [],
      mocks.deletePrediction?.status || 200
    )
  );
  removePredictionFromGroup.mockReturnValue(
    apiResponse(
      mocks?.removePredictionFromGroup?.data || null,
      mocks.removePredictionFromGroup?.status || 200
    )
  );

  let mockReturns;
  await act(async () => {
    mockReturns = renderWithContext(SubmittedPredictions, props, user);
  });
  return mockReturns;
};

describe("SubmittedPredictions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should render a login prompt if no user", async () => {
    await renderWithProps({}, {}, null);
    expect(screen.queryByText(/login to view/i)).toBeInTheDocument();
    await clickByText("Login");
    expect(screen.queryByText(/login or register/i)).toBeInTheDocument();
  });
  describe("Active", () => {
    it("should render the submission info", async () => {
      await renderWithProps({
        getPredictions: {
          data: [{ ...prediction, competitionID: competition }],
        },
      });

      expect(screen.queryByText(prediction.name)).toBeInTheDocument();
      expect(screen.queryByText(competition.name)).toBeInTheDocument();
      expect(screen.queryByText(prediction.misc.winner)).toBeInTheDocument();
    });
    it("should navigate to edit the submission", async () => {
      const { navMock } = await renderWithProps({
        getPredictions: {
          data: [{ ...prediction, competitionID: competition }],
        },
      });

      await clickByText("Edit");
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/submissions?id=" +
          prediction._id +
          "&competitionID=" +
          competition._id +
          "&secondChance=false"
      );
    });
    it("should navigate to the leaderboard", async () => {
      const { navMock } = await renderWithProps({
        getPredictions: {
          data: [{ ...prediction, competitionID: competition }],
        },
      });

      await clickByText("View Sitewide Leaderboard");
      expect(navMock).toHaveBeenCalledTimes(1);
      expect(navMock).toHaveBeenCalledWith(
        "/competitions?leaderboard=show&competitionID=" +
          competition._id +
          "&groupID=all&secondChance=false"
      );
    });
    it("should not show the delete button if submission deadline has passed", async () => {
      await renderWithProps({
        getPredictions: {
          data: [
            {
              ...prediction,
              competitionID: { ...competition, submissionDeadline: new Date() },
            },
          ],
        },
      });
      expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });
    it("should delete the submission", async () => {
      await renderWithProps({
        getPredictions: {
          data: [{ ...prediction, competitionID: competition }],
        },
      });
      await clickByText("Delete");
      await clickByText("OK");
      expect(deletePrediction).toHaveBeenCalledTimes(1);
      expect(deletePrediction).toHaveBeenCalledWith(prediction._id);
    });
  });
});
