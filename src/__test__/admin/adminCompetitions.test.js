import { act, screen } from "@testing-library/react";
import AdminCompetitions from "../../components/admin/adminCompetitions";
import { getResult } from "../../services/resultsService";
import { getLeaderboard } from "../../services/predictionsService";
import { toast } from "react-toastify";
import { apiResponse, clickByText, renderWithContext } from "../testHelpers";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

jest.mock("../../services/resultsService", () => ({
  getResult: jest.fn(),
}));

jest.mock("../../services/predictionsService", () => ({
  getLeaderboard: jest.fn(),
}));

const activeCompetition = {
  _id: "1",
  code: "WC2026",
  name: "World Cup 2026",
  submissionDeadline: "2099-05-01T12:00:00.000Z",
  competitionEnd: "2099-07-19T00:00:00.000Z",
  lastCalculated: null,
  secondChance: null,
};

const completedCompetition = {
  _id: "2",
  code: "WC2022",
  name: "World Cup 2022",
  submissionDeadline: "2022-11-20T12:00:00.000Z",
  competitionEnd: "2022-12-18T00:00:00.000Z",
  lastCalculated: "2022-12-19T10:00:00.000Z",
  secondChance: {
    availableFrom: "2022-11-28T00:00:00.000Z",
    submissionDeadline: "2022-12-10T12:00:00.000Z",
    competitionStart: "2022-12-09T00:00:00.000Z",
  },
};

const defaultCompetitions = [activeCompetition, completedCompetition];

function renderComponent(competitions = defaultCompetitions) {
  return renderWithContext(AdminCompetitions, { competitions }, { role: "admin" });
}

describe("AdminCompetitions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render a card for each competition", async () => {
    await act(async () => renderComponent());
    expect(screen.queryByText("World Cup 2026")).toBeInTheDocument();
    expect(screen.queryByText("World Cup 2022")).toBeInTheDocument();
  });

  it("should show the competition code in the header", async () => {
    await act(async () => renderComponent());
    expect(screen.queryByText("WC2026")).toBeInTheDocument();
    expect(screen.queryByText("WC2022")).toBeInTheDocument();
  });

  it("should show second chance dates for competitions that have one", async () => {
    await act(async () => renderComponent());
    expect(screen.queryByText("Available From")).toBeInTheDocument();
  });

  it("should show no second chance text for competitions without one", async () => {
    await act(async () => renderComponent());
    expect(screen.queryByText(/No second chance/)).toBeInTheDocument();
  });

  it("should show No competitions found when list is empty", async () => {
    await act(async () => renderComponent([]));
    expect(screen.queryByText("No competitions found.")).toBeInTheDocument();
  });

  it("should not call getResult on initial load", async () => {
    await act(async () => renderComponent());
    expect(getResult).not.toHaveBeenCalled();
  });

  describe("submission info", () => {
    it("should show a download icon button per card before info is fetched", async () => {
      await act(async () => renderComponent());
      expect(screen.queryAllByTestId("download_icon").length).toBe(2);
    });

    it("should switch to a refresh icon after info is loaded", async () => {
      getResult.mockReturnValue(apiResponse({}));
      getLeaderboard.mockReturnValue(apiResponse({ count: 42, predictions: [] }));
      await act(async () => renderComponent([activeCompetition]));
      await act(async () => clickByText("download_icon", 0, true));
      expect(screen.queryAllByTestId("download_icon").length).toBe(0);
      expect(screen.queryAllByTestId("refresh_icon").length).toBe(1);
    });

    it("should show result status and primary count after loading", async () => {
      getResult.mockReturnValue(apiResponse({}));
      getLeaderboard.mockReturnValue(apiResponse({ count: 42, predictions: [] }));
      await act(async () => renderComponent());
      await act(async () => clickByText("download_icon", 0, true));
      expect(screen.queryByText("Posted")).toBeInTheDocument();
      expect(screen.queryByText("42")).toBeInTheDocument();
    });

    it("should show Not posted when result fetch returns 404", async () => {
      getResult.mockReturnValue(apiResponse("not found", 404));
      getLeaderboard.mockReturnValue(apiResponse({ count: 0, predictions: [] }));
      await act(async () => renderComponent());
      await act(async () => clickByText("download_icon", 0, true));
      expect(screen.queryByText("Not posted")).toBeInTheDocument();
    });

    it("should show second chance count in the second chance section after loading", async () => {
      getResult.mockReturnValue(apiResponse({}));
      getLeaderboard
        .mockReturnValueOnce(apiResponse({ count: 100, predictions: [] }))
        .mockReturnValueOnce(apiResponse({ count: 25, predictions: [] }));
      await act(async () => renderComponent([completedCompetition]));
      await act(async () => clickByText("download_icon", 0, true));
      expect(screen.queryByText("100")).toBeInTheDocument();
      expect(screen.queryByText("25")).toBeInTheDocument();
    });

    it("should show an error toast if loading fails", async () => {
      getResult.mockReturnValue(apiResponse({}));
      getLeaderboard.mockReturnValue(apiResponse("error", 500));
      await act(async () => renderComponent());
      await act(async () => clickByText("download_icon", 0, true));
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
