import { act, screen, fireEvent } from "@testing-library/react";
import AdminToolsResults from "../../components/admin/adminToolsResults";
import AdminToolsResultsEdit from "../../components/admin/adminToolsResultsEdit";
import { getResult, calculateCompetition, updateResult } from "../../services/resultsService";
import { getMatches } from "../../services/matchService";
import { toast } from "react-toastify";
import { apiResponse, clickByText, renderWithContext } from "../testHelpers";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

jest.mock("../../services/resultsService", () => ({
  getResult: jest.fn(),
  calculateCompetition: jest.fn(),
  updateResult: jest.fn(),
}));

jest.mock("../../services/matchService", () => ({
  getMatches: jest.fn(),
}));

jest.mock("../../textMaps/logos", () => ({}));
jest.mock("../../utils/predictionsUtil", () => ({
  filterRealTeams: (teams) => teams,
  findCountryLogo: (t) => t.toLowerCase(),
}));

jest.mock("../../components/predictions/maker/teamSelectComponent", () => {
  const MockTeamSelect = ({ title, selectedOption, onSelect }) => (
    <button data-testid="team-select" onClick={() => onSelect("Germany")}>{selectedOption || title}</button>
  );
  MockTeamSelect.displayName = "MockTeamSelect";
  return MockTeamSelect;
});

// ── Fixtures for AdminToolsResults ──────────────────────────────────────────

const activeCompetition = {
  _id: "comp1",
  code: "WC2026",
  name: "World Cup 2026",
  competitionEnd: "2099-07-19T00:00:00.000Z",
};

const completedCompetition = {
  _id: "comp2",
  code: "WC2022",
  name: "World Cup 2022",
  competitionEnd: "2022-12-18T00:00:00.000Z",
};

const mockResult = {
  code: "WC2026",
  group: [{ groupName: "Group A", teamOrder: ["Brazil", "Argentina"] }],
  playoff: [{ round: 1, teams: ["Brazil"], points: 10 }],
};

const mockCompetitions = [activeCompetition, completedCompetition];

function renderComponent(competitions = mockCompetitions) {
  return renderWithContext(AdminToolsResults, { competitions }, { role: "admin" });
}

// ── Fixtures for AdminToolsResultsEdit ──────────────────────────────────────

const editCompetition = {
  _id: "comp1",
  code: "WC2026",
  name: "World Cup 2026",
  miscPicks: [
    { name: "winner", label: "Winner" },
    { name: "thirdPlace", label: "Third Place" },
    { name: "topScorer", label: "Top Scorer" },
  ],
  scoring: {
    playoff: [
      { roundNumber: 1, roundName: "Round of 16", points: 2 },
      { roundNumber: 2, roundName: "Quarter-Finals", points: 4 },
    ],
  },
};

const editCompetitionNoMultiMisc = {
  ...editCompetition,
  miscPicks: [
    { name: "winner", label: "Winner" },
    { name: "thirdPlace", label: "Third Place" },
  ],
};

const editInitialData = {
  code: "WC2026",
  misc: { winner: "Brazil", thirdPlace: "Croatia", topScorer: ["Mbappe"] },
  group: [
    { groupName: "A", teamOrder: ["Brazil", "Argentina", "Mexico", "Poland"] },
    { groupName: "B", teamOrder: ["France", "Denmark"] },
  ],
  playoff: [
    { round: 1, teams: ["Brazil", "Argentina"], points: 2 },
    { round: 2, teams: ["Brazil"], points: 4 },
  ],
  leaders: [
    {
      key: "topScorer",
      label: "Top Scorer",
      leaders: [
        { team: "France", player: "Mbappe", value: "8" },
        { team: "England", player: "Kane", value: "6" },
      ],
    },
  ],
};

const groupMatches = [
  { _id: "m1", type: "Group", groupName: "A", homeTeamName: "Brazil", awayTeamName: "Argentina", round: 1 },
  { _id: "m2", type: "Group", groupName: "A", homeTeamName: "Mexico", awayTeamName: "Poland", round: 1 },
  { _id: "m3", type: "Group", groupName: "B", homeTeamName: "France", awayTeamName: "Denmark", round: 1 },
  { _id: "m4", type: "Playoff", groupName: null, homeTeamName: "Brazil", awayTeamName: "France", round: 1 },
];

function renderEdit({
  comp = editCompetition,
  data = editInitialData,
  onCancel = jest.fn(),
  onSave = jest.fn(),
} = {}) {
  return renderWithContext(
    AdminToolsResultsEdit,
    { competition: comp, initialData: data, onCancel, onSave },
    { role: "admin" },
  );
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("AdminToolsResults", () => {
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

    it("should show Complete badge for expired competitions", async () => {
      await act(async () => renderComponent());
      expect(screen.queryByText("Complete")).toBeInTheDocument();
    });

    it("should not show Edit Results before results are loaded", async () => {
      await act(async () => renderComponent([activeCompetition]));
      expect(screen.queryByText("Edit Results")).not.toBeInTheDocument();
    });

    it("should show StatusNote when competitions list is empty", async () => {
      await act(async () => renderComponent([]));
      expect(screen.queryByText("No competitions found.")).toBeInTheDocument();
    });

    it("should not show Calculate before results are loaded", async () => {
      await act(async () => renderComponent());
      expect(screen.queryByText("Calculate")).not.toBeInTheDocument();
    });
  });

  describe("loading results", () => {
    it("should call getResult with the competition id on load", async () => {
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Results"));
      expect(getResult).toHaveBeenCalledWith("comp1");
    });

    it("should show an error toast if loading fails", async () => {
      getResult.mockReturnValue(apiResponse("error", 500));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Results"));
      expect(toast.error).toHaveBeenCalled();
    });

    it("should show StatusNote when no results are posted (404)", async () => {
      getResult.mockReturnValue(apiResponse("not found", 404));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Results"));
      expect(screen.queryByText(/No results found/)).toBeInTheDocument();
      expect(screen.queryByText("create them")).toBeInTheDocument();
    });

    it("should open the edit form when create them is clicked after a 404", async () => {
      getResult.mockReturnValue(apiResponse("not found", 404));
      getMatches.mockReturnValue(apiResponse([]));
      await act(async () => renderComponent([activeCompetition]));
      await act(async () => clickByText("Load Results"));
      await act(async () => clickByText("create them"));
      expect(screen.queryByText(/Editing Results/)).toBeInTheDocument();
    });

    it("should show the Winners and Bonus section header", async () => {
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Results"));
      expect(screen.queryByText("Winners and Bonus")).toBeInTheDocument();
    });

    it("should show group standings after loading", async () => {
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Results"));
      expect(screen.queryByText("Group Standings")).toBeInTheDocument();
      expect(screen.queryByText("Group A")).toBeInTheDocument();
      expect(screen.queryAllByText("Brazil").length).toBeGreaterThan(0);
    });

    it("should show playoff rounds after loading", async () => {
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Results"));
      expect(screen.queryByText("Playoff Rounds")).toBeInTheDocument();
      expect(screen.queryByText("Round 1")).toBeInTheDocument();
    });

    it("should show the Calculate button after a successful load", async () => {
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Results"));
      expect(screen.queryByText("Calculate")).toBeInTheDocument();
    });

    it("should not show Calculate after a 404 load", async () => {
      getResult.mockReturnValue(apiResponse("not found", 404));
      await act(async () => renderComponent());
      await act(async () => clickByText("Load Results"));
      expect(screen.queryByText("Calculate")).not.toBeInTheDocument();
    });
  });

  describe("calculate", () => {
    beforeEach(async () => {
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => renderComponent([activeCompetition]));
      await act(async () => clickByText("Load Results"));
    });

    it("should call calculateCompetition with the competition code", async () => {
      calculateCompetition.mockReturnValue(apiResponse("ok"));
      await act(async () => clickByText("Calculate"));
      expect(calculateCompetition).toHaveBeenCalledWith("WC2026");
    });

    it("should show a success toast on successful calculation", async () => {
      calculateCompetition.mockReturnValue(apiResponse("ok"));
      await act(async () => clickByText("Calculate"));
      expect(toast.success).toHaveBeenCalled();
    });

    it("should show an error toast on failed calculation", async () => {
      calculateCompetition.mockReturnValue(apiResponse("Calculation failed", 500));
      await act(async () => clickByText("Calculate"));
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe("completed competition confirm", () => {
    beforeEach(async () => {
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => renderComponent([completedCompetition]));
      await act(async () => clickByText("Load Results"));
    });

    it("should show a confirm modal instead of calculating immediately", async () => {
      await act(async () => clickByText("Calculate"));
      expect(calculateCompetition).not.toHaveBeenCalled();
      expect(screen.queryByText("Competition Complete")).toBeInTheDocument();
      expect(screen.queryByText(/has already ended/)).toBeInTheDocument();
    });

    it("should not calculate if the confirm is cancelled", async () => {
      await act(async () => clickByText("Calculate"));
      await act(async () => clickByText("Cancel"));
      expect(calculateCompetition).not.toHaveBeenCalled();
    });

    it("should calculate after confirming", async () => {
      calculateCompetition.mockReturnValue(apiResponse("ok"));
      await act(async () => clickByText("Calculate"));
      await act(async () => clickByText("Calculate", 1));
      expect(calculateCompetition).toHaveBeenCalledWith("WC2022");
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe("edit results", () => {
    beforeEach(async () => {
      getResult.mockReturnValue(apiResponse(mockResult));
      getMatches.mockReturnValue(apiResponse([]));
      await act(async () => renderComponent([activeCompetition]));
      await act(async () => clickByText("Load Results"));
    });

    it("should show Edit Results button after a successful load", async () => {
      expect(screen.queryByText("Edit Results")).toBeInTheDocument();
    });

    it("should hide Edit Results and Calculate while editing", async () => {
      await act(async () => clickByText("Edit Results"));
      expect(screen.queryByText("Edit Results")).not.toBeInTheDocument();
      expect(screen.queryByText("Calculate")).not.toBeInTheDocument();
    });

    it("should show the editing banner with the competition name", async () => {
      await act(async () => clickByText("Edit Results"));
      expect(screen.queryByText(/Editing Results/)).toBeInTheDocument();
      expect(screen.queryAllByText(/World Cup 2026/).length).toBeGreaterThan(0);
    });

    it("should return to summary on cancel from the banner", async () => {
      await act(async () => clickByText("Edit Results"));
      await act(async () => clickByText("Cancel", 0));
      expect(screen.queryByText(/Editing Results/)).not.toBeInTheDocument();
      expect(screen.queryByText("Edit Results")).toBeInTheDocument();
    });

    it("should call updateResult with the competition code on save", async () => {
      updateResult.mockReturnValue(apiResponse({}, 200));
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => clickByText("Edit Results"));
      await act(async () => clickByText("Save Results"));
      expect(updateResult).toHaveBeenCalledWith(
        "WC2026",
        expect.objectContaining({ code: "WC2026" }),
      );
    });

    it("should show a success toast and return to summary after save", async () => {
      updateResult.mockReturnValue(apiResponse({}, 200));
      getResult.mockReturnValue(apiResponse(mockResult));
      await act(async () => clickByText("Edit Results"));
      await act(async () => clickByText("Save Results"));
      expect(toast.success).toHaveBeenCalled();
      expect(screen.queryByText(/Editing Results/)).not.toBeInTheDocument();
    });

    it("should show an error toast and stay in edit mode on failed save", async () => {
      updateResult.mockReturnValue(apiResponse("Save failed", 400));
      await act(async () => clickByText("Edit Results"));
      await act(async () => clickByText("Save Results"));
      expect(toast.error).toHaveBeenCalled();
      expect(screen.queryByText(/Editing Results/)).toBeInTheDocument();
    });
  });
});

describe("AdminToolsResultsEdit", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getMatches.mockReturnValue(apiResponse([]));
  });

  describe("rendering", () => {
    it("shows the editing banner with the competition name", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByText(/Editing Results/)).toBeInTheDocument();
      expect(screen.queryByText("World Cup 2026")).toBeInTheDocument();
    });

    it("shows the Finals and Bonus section header", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByText("Finals and Bonus")).toBeInTheDocument();
    });

    it("shows the Group Standings section header", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByText("Group Standings")).toBeInTheDocument();
    });

    it("shows the Playoff Rounds section header", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByText("Playoff Rounds")).toBeInTheDocument();
    });

    it("shows the Winner label", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByText("Winner")).toBeInTheDocument();
    });

    it("shows the Third Place label when thirdPlace is in miscPicks", async () => {
      await act(async () => renderEdit());
      expect(screen.queryAllByText("Third Place").length).toBeGreaterThan(0);
    });

    it("shows the Leaders section when non-single misc picks exist", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByText("Leaders")).toBeInTheDocument();
    });

    it("does not show the Leaders section when no non-single misc picks", async () => {
      await act(async () => renderEdit({ comp: editCompetitionNoMultiMisc }));
      expect(screen.queryByText("Leaders")).not.toBeInTheDocument();
    });
  });

  describe("group standings", () => {
    it("shows group names from initialData", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByText("A")).toBeInTheDocument();
      expect(screen.queryByText("B")).toBeInTheDocument();
    });

    it("shows textarea with initial team order", async () => {
      await act(async () => renderEdit());
      const textareas = screen.queryAllByRole("textbox");
      const groupA = textareas.find((t) => t.value.includes("Brazil"));
      expect(groupA).toBeTruthy();
      expect(groupA.value).toContain("Argentina");
    });

    it("shows Teams (in order) label for regular groups", async () => {
      await act(async () => renderEdit());
      expect(screen.queryAllByText("Teams (in order)").length).toBeGreaterThan(0);
    });

    it("populates team chips from matches after mount", async () => {
      getMatches.mockReturnValue(apiResponse(groupMatches));
      await act(async () => renderEdit());
      expect(screen.queryAllByText("Brazil").length).toBeGreaterThan(0);
    });
  });

  describe("playoff rounds", () => {
    it("shows round names from competition scoring", async () => {
      getMatches.mockReturnValue(apiResponse(groupMatches));
      await act(async () => renderEdit());
      expect(screen.queryByText("Round of 16")).toBeInTheDocument();
    });

    it("falls back to Round N label when round name is not in scoring", async () => {
      const compNoScoring = { ...editCompetition, scoring: {} };
      getMatches.mockReturnValue(apiResponse(groupMatches));
      await act(async () => renderEdit({ comp: compNoScoring }));
      expect(screen.queryByText("Round 1")).toBeInTheDocument();
    });
  });

  describe("winners and bonus", () => {
    it("shows the current winner via the team select", async () => {
      await act(async () => renderEdit());
      expect(screen.queryAllByText("Brazil").length).toBeGreaterThan(0);
    });

    it("shows top scorer label in Finals and Bonus section", async () => {
      await act(async () => renderEdit());
      expect(screen.queryAllByText("Top Scorer").length).toBeGreaterThan(0);
    });

    it("shows existing multi-pick chip", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByText("Mbappe")).toBeInTheDocument();
    });

    it("adds a team to miscArray when team select fires", async () => {
      await act(async () => renderEdit());
      const addButtons = screen.queryAllByTestId("team-select");
      const addTopScorer = addButtons.find((b) => b.textContent.includes("Add Top Scorer"));
      await act(async () => fireEvent.click(addTopScorer));
      expect(screen.queryAllByText("Germany").length).toBeGreaterThan(0);
    });
  });

  describe("leaders", () => {
    it("shows leader entries from initialData.leaders", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByDisplayValue("Mbappe")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("8")).toBeInTheDocument();
    });

    it("shows player input pre-populated for each leader", async () => {
      await act(async () => renderEdit());
      expect(screen.queryByDisplayValue("Kane")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("6")).toBeInTheDocument();
    });

    it("shows the team name for each leader entry", async () => {
      await act(async () => renderEdit());
      expect(screen.queryAllByText("France").length).toBeGreaterThan(0);
      expect(screen.queryAllByText("England").length).toBeGreaterThan(0);
    });

    it("updates player value when input changes", async () => {
      await act(async () => renderEdit());
      const playerInput = screen.queryByDisplayValue("Mbappe");
      await act(async () => fireEvent.change(playerInput, { target: { value: "Mbappe K" } }));
      expect(screen.queryByDisplayValue("Mbappe K")).toBeInTheDocument();
    });

    it("adds a new leader entry when team select fires in leaders section", async () => {
      await act(async () => renderEdit());
      const before = screen.queryAllByPlaceholderText("Player (optional)").length;
      const buttons = screen.queryAllByTestId("team-select");
      const addLeader = buttons.find((b) => b.textContent.includes("Top Scorer leader"));
      await act(async () => fireEvent.click(addLeader));
      const after = screen.queryAllByPlaceholderText("Player (optional)").length;
      expect(after).toBeGreaterThan(before);
    });
  });

  describe("cancel", () => {
    it("calls onCancel when Cancel is clicked in the banner", async () => {
      const onCancel = jest.fn();
      await act(async () => renderEdit({ onCancel }));
      const cancelButtons = screen.queryAllByText("Cancel");
      await act(async () => fireEvent.click(cancelButtons[0]));
      expect(onCancel).toHaveBeenCalled();
    });

    it("calls onCancel when Cancel is clicked in the footer", async () => {
      const onCancel = jest.fn();
      await act(async () => renderEdit({ onCancel }));
      const cancelButtons = screen.queryAllByText("Cancel");
      await act(async () => fireEvent.click(cancelButtons[cancelButtons.length - 1]));
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe("save", () => {
    it("calls updateResult with the competition code on Save Results", async () => {
      updateResult.mockReturnValue(apiResponse({}, 200));
      await act(async () => renderEdit());
      await act(async () => fireEvent.click(screen.queryByText("Save Results")));
      expect(updateResult).toHaveBeenCalledWith(
        "WC2026",
        expect.objectContaining({ code: "WC2026" }),
      );
    });

    it("includes group data in the save body", async () => {
      updateResult.mockReturnValue(apiResponse({}, 200));
      await act(async () => renderEdit());
      await act(async () => fireEvent.click(screen.queryByText("Save Results")));
      const body = updateResult.mock.calls[0][1];
      expect(body.group.some((g) => g.groupName === "A")).toBe(true);
    });

    it("includes misc data in the save body", async () => {
      updateResult.mockReturnValue(apiResponse({}, 200));
      await act(async () => renderEdit());
      await act(async () => fireEvent.click(screen.queryByText("Save Results")));
      const body = updateResult.mock.calls[0][1];
      expect(body.misc.winner).toBe("Brazil");
      expect(body.misc.thirdPlace).toBe("Croatia");
    });

    it("includes leaders in the save body", async () => {
      updateResult.mockReturnValue(apiResponse({}, 200));
      await act(async () => renderEdit());
      await act(async () => fireEvent.click(screen.queryByText("Save Results")));
      const body = updateResult.mock.calls[0][1];
      expect(body.leaders).toBeDefined();
      expect(body.leaders.length).toBeGreaterThan(0);
      expect(body.leaders[0].key).toBe("topScorer");
    });

    it("shows a success toast on successful save", async () => {
      updateResult.mockReturnValue(apiResponse({}, 200));
      await act(async () => renderEdit());
      await act(async () => fireEvent.click(screen.queryByText("Save Results")));
      expect(toast.success).toHaveBeenCalled();
    });

    it("calls onSave on successful save", async () => {
      updateResult.mockReturnValue(apiResponse({}, 200));
      const onSave = jest.fn();
      await act(async () => renderEdit({ onSave }));
      await act(async () => fireEvent.click(screen.queryByText("Save Results")));
      expect(onSave).toHaveBeenCalled();
    });

    it("shows an error toast on failed save", async () => {
      updateResult.mockReturnValue(apiResponse("Server error", 500));
      await act(async () => renderEdit());
      await act(async () => fireEvent.click(screen.queryByText("Save Results")));
      expect(toast.error).toHaveBeenCalled();
    });

    it("does not call onSave on failed save", async () => {
      updateResult.mockReturnValue(apiResponse("Server error", 500));
      const onSave = jest.fn();
      await act(async () => renderEdit({ onSave }));
      await act(async () => fireEvent.click(screen.queryByText("Save Results")));
      expect(onSave).not.toHaveBeenCalled();
    });
  });
});
