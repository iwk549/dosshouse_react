import { act, screen } from "@testing-library/react";
import AdminToolsMatches from "../../components/admin/adminToolsMatches";
import { getMatches, updateMatch } from "../../services/matchService";
import { updateMiscPickInfo } from "../../services/competitionService";
import { toast } from "react-toastify";
import { apiResponse, clickByText, changeText, renderWithContext } from "../testHelpers";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("../../services/matchService", () => ({
  getMatches: jest.fn(),
  updateMatch: jest.fn(),
}));

jest.mock("../../services/competitionService", () => ({
  updateMiscPickInfo: jest.fn(),
}));

jest.mock("../../textMaps/logos", () => ({ brazil: "brazil.png", argentina: "argentina.png" }));
jest.mock("../../utils/predictionsUtil", () => ({
  filterRealTeams: (teams) => teams,
  findCountryLogo: (t) => t.toLowerCase(),
}));

const activeCompetition = {
  _id: "comp1",
  name: "World Cup 2026",
  code: "WC2026",
  competitionEnd: "2099-07-19T00:00:00.000Z",
};

const completedCompetition = {
  _id: "comp2",
  name: "World Cup 2022",
  code: "WC2022",
  competitionEnd: "2022-12-18T00:00:00.000Z",
};

const pendingMatch = {
  _id: "m1",
  bracketCode: "WC2026",
  matchNumber: 1,
  round: 1,
  type: "Group",
  homeTeamName: "Brazil",
  awayTeamName: "Argentina",
  homeTeamGoals: null,
  awayTeamGoals: null,
  homeTeamPKs: null,
  awayTeamPKs: null,
  matchAccepted: false,
  dateTime: "2026-06-14T18:00:00.000Z",
  location: "Stadium A",
};

const acceptedMatch = {
  _id: "m2",
  bracketCode: "WC2026",
  matchNumber: 2,
  round: 1,
  type: "Group",
  homeTeamName: "Brazil",
  awayTeamName: "Argentina",
  homeTeamGoals: 2,
  awayTeamGoals: 1,
  homeTeamPKs: null,
  awayTeamPKs: null,
  matchAccepted: true,
  dateTime: "2026-06-15T18:00:00.000Z",
  location: "Stadium B",
};

const finalMatch = {
  _id: "m3",
  bracketCode: "WC2026",
  matchNumber: 64,
  round: 7,
  type: "Playoff",
  homeTeamName: "France",
  awayTeamName: "England",
  homeTeamGoals: null,
  awayTeamGoals: null,
  homeTeamPKs: null,
  awayTeamPKs: null,
  matchAccepted: false,
  dateTime: "2026-07-19T18:00:00.000Z",
  location: "Final Stadium",
};

const thirdPlaceInfo = {
  homeTeamName: "Croatia",
  awayTeamName: "Morocco",
  homeTeamGoals: null,
  awayTeamGoals: null,
  homeTeamPKs: null,
  awayTeamPKs: null,
  matchAccepted: false,
  matchNumber: 63,
  round: 1001,
  type: "Playoff",
  dateTime: "2026-07-18T15:00:00.000Z",
  location: "Third Place Stadium",
};

const competitionWithThirdPlace = {
  ...activeCompetition,
  miscPicks: [{ name: "thirdPlace", label: "3rd Place Match", info: thirdPlaceInfo }],
};

const defaultCompetitions = [activeCompetition, completedCompetition];

function renderComponent(competitions = defaultCompetitions) {
  return renderWithContext(AdminToolsMatches, { competitions }, { role: "admin" });
}

describe("AdminToolsMatches", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("competition list", () => {
    it("should render a card for each competition", async () => {
      await act(async () => renderComponent());
      expect(screen.queryByText("World Cup 2026")).toBeInTheDocument();
      expect(screen.queryByText("World Cup 2022")).toBeInTheDocument();
    });

    it("should show the competition code", async () => {
      await act(async () => renderComponent());
      expect(screen.queryByText("WC2026")).toBeInTheDocument();
      expect(screen.queryByText("WC2022")).toBeInTheDocument();
    });

    it("should show the Complete badge for expired competitions", async () => {
      await act(async () => renderComponent());
      expect(screen.queryByText("Complete")).toBeInTheDocument();
    });

    it("should not show the Complete badge for active competitions", async () => {
      await act(async () => renderComponent([activeCompetition]));
      expect(screen.queryByText("Complete")).not.toBeInTheDocument();
    });

    it("should show StatusNote when competitions list is empty", async () => {
      await act(async () => renderComponent([]));
      expect(screen.queryByText("No competitions found.")).toBeInTheDocument();
    });

    it("should not show the accepted toggle before a competition is loaded", async () => {
      await act(async () => renderComponent());
      expect(screen.queryByText("Show Accepted")).not.toBeInTheDocument();
    });
  });

  describe("loading matches", () => {
    it("should call getMatches with the competition id on load", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      expect(getMatches).toHaveBeenCalledWith("comp1");
    });

    it("should show an error toast if loading fails", async () => {
      getMatches.mockReturnValue(apiResponse("error", 500));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      expect(toast.error).toHaveBeenCalled();
    });

    it("should display pending matches after loading", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      expect(screen.queryByText("Brazil vs Argentina")).toBeInTheDocument();
    });

    it("should show the type and round info in the match row", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      expect(screen.queryByText("R1 #1")).toBeInTheDocument();
      expect(screen.queryByText("Group")).toBeInTheDocument();
    });

    it("should show Pending badge for non-accepted matches", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      expect(screen.queryByText("Pending")).toBeInTheDocument();
    });

    it("should show the Show Accepted toggle after loading", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      expect(screen.queryByText("Show Accepted")).toBeInTheDocument();
    });

    it("should show No matches found when the list is empty", async () => {
      getMatches.mockReturnValue(apiResponse([]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      expect(screen.queryByText("No matches found.")).toBeInTheDocument();
    });
  });

  describe("accepted match toggle", () => {
    it("should hide accepted matches by default", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch, acceptedMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      expect(screen.queryByText("Accepted")).not.toBeInTheDocument();
    });

    it("should show accepted matches after toggling on", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch, acceptedMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      await act(async () => clickByText("Show Accepted"));
      expect(screen.queryByText("Accepted")).toBeInTheDocument();
    });

    it("should change toggle label to Hide Accepted when showing", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      await act(async () => clickByText("Show Accepted"));
      expect(screen.queryByText("Hide Accepted")).toBeInTheDocument();
    });

    it("should hide accepted matches again after toggling off", async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch, acceptedMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      await act(async () => clickByText("Show Accepted"));
      await act(async () => clickByText("Hide Accepted"));
      expect(screen.queryByText("Accepted")).not.toBeInTheDocument();
    });
  });

  describe("edit form", () => {
    beforeEach(async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch]));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Matches"));
      await act(async () => clickByText("edit_icon", 0, true));
    });

    it("should show the edit form with reference info when edit is clicked", async () => {
      expect(screen.queryByText("R1 #1")).toBeInTheDocument();
      expect(screen.queryByLabelText("Home Goals")).toBeInTheDocument();
      expect(screen.queryByLabelText("Away Goals")).toBeInTheDocument();
    });

    it("should show the cancel and save buttons", async () => {
      expect(screen.queryByText("Cancel")).toBeInTheDocument();
      expect(screen.queryByText("Save")).toBeInTheDocument();
    });

    it("should close the edit form on cancel", async () => {
      await act(async () => clickByText("Cancel"));
      expect(screen.queryByLabelText("Home Goals")).not.toBeInTheDocument();
    });

    it("should call updateMatch with the correct data on save", async () => {
      updateMatch.mockReturnValue(apiResponse({ ...pendingMatch, homeTeamGoals: 3 }));
      await act(async () => changeText("Home Goals", "3"));
      await act(async () => clickByText("Save"));
      expect(updateMatch).toHaveBeenCalledWith(
        "m1",
        expect.objectContaining({
          bracketCode: "WC2026",
          matchNumber: 1,
          round: 1,
          homeTeamGoals: 3,
        }),
      );
    });

    it("should show a success toast and close the form on successful save", async () => {
      updateMatch.mockReturnValue(apiResponse({ ...pendingMatch }));
      await act(async () => clickByText("Save"));
      expect(toast.success).toHaveBeenCalled();
      expect(screen.queryByLabelText("Home Goals")).not.toBeInTheDocument();
    });

    it("should show an error toast on failed save", async () => {
      updateMatch.mockReturnValue(apiResponse("Update failed", 400));
      await act(async () => clickByText("Save"));
      expect(toast.error).toHaveBeenCalled();
    });

    it("should update the match in the list after a successful save", async () => {
      const updated = { ...pendingMatch, homeTeamGoals: 2, awayTeamGoals: 0, matchAccepted: true };
      updateMatch.mockReturnValue(apiResponse(updated));
      await act(async () => clickByText("Save"));
      await act(async () => clickByText("Show Accepted"));
      expect(screen.queryByText("Accepted")).toBeInTheDocument();
    });
  });

  describe("third place match", () => {
    beforeEach(async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch, finalMatch]));
      await act(async () =>
        renderWithContext(AdminToolsMatches, { competitions: [competitionWithThirdPlace] }, { role: "admin" })
      );
      await act(async () => clickByText("Load Matches"));
    });

    it("should show the third place match when competition has thirdPlace info", async () => {
      expect(screen.queryByText("Croatia vs Morocco")).toBeInTheDocument();
    });

    it("should show the 3rd Place label on the third place match row", async () => {
      expect(screen.queryByText("3rd Place")).toBeInTheDocument();
    });

    it("should render the final match after the third place match", async () => {
      const rows = screen.queryAllByText(/vs/);
      const texts = rows.map((el) => el.textContent);
      const thirdIdx = texts.findIndex((t) => t.includes("Croatia"));
      const finalIdx = texts.findIndex((t) => t.includes("France"));
      expect(thirdIdx).toBeLessThan(finalIdx);
    });

    it("should call updateMiscPickInfo (not updateMatch) when saving the third place match", async () => {
      updateMiscPickInfo.mockReturnValue(apiResponse({ ...thirdPlaceInfo, homeTeamGoals: 2 }, 200));
      await act(async () => clickByText("edit_icon", 1, true));
      await act(async () => changeText("Home Goals", "2"));
      await act(async () => clickByText("Save"));
      expect(updateMiscPickInfo).toHaveBeenCalledWith(
        "WC2026",
        "thirdPlace",
        expect.objectContaining({ homeTeamName: "Croatia", homeTeamGoals: 2 }),
      );
      expect(updateMatch).not.toHaveBeenCalled();
    });

  });

  describe("third place match — accepted", () => {
    const acceptedThirdPlace = {
      ...activeCompetition,
      miscPicks: [{ name: "thirdPlace", label: "3rd Place Match", info: { ...thirdPlaceInfo, matchAccepted: true } }],
    };

    beforeEach(async () => {
      getMatches.mockReturnValue(apiResponse([pendingMatch, finalMatch]));
      await act(async () =>
        renderWithContext(AdminToolsMatches, { competitions: [acceptedThirdPlace] }, { role: "admin" })
      );
      await act(async () => clickByText("Load Matches"));
    });

    it("should hide the accepted third place match by default", async () => {
      expect(screen.queryByText("Croatia vs Morocco")).not.toBeInTheDocument();
    });

    it("should show the accepted third place match after toggling Show Accepted", async () => {
      await act(async () => clickByText("Show Accepted"));
      expect(screen.queryByText("Croatia vs Morocco")).toBeInTheDocument();
    });
  });
});
