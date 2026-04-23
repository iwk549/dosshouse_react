import { act, screen } from "@testing-library/react";
import AdminTools from "../../components/admin/adminTools";
import { getActiveCompetitions, getExpiredCompetitions } from "../../services/competitionService";
import { calculateCompetition } from "../../services/resultsService";
import { toast } from "react-toastify";
import { apiResponse, clickByText, renderWithContext } from "../testHelpers";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

jest.mock("../../services/competitionService", () => ({
  getActiveCompetitions: jest.fn(),
  getExpiredCompetitions: jest.fn(),
}));

jest.mock("../../services/resultsService", () => ({
  calculateCompetition: jest.fn(),
}));

const mockCompetitions = [
  { code: "WC2026", name: "World Cup 2026", competitionEnd: "2099-07-19T00:00:00.000Z" },
  { code: "WC2022", name: "World Cup 2022", competitionEnd: "2022-12-18T00:00:00.000Z" },
];

function renderComponent() {
  return renderWithContext(AdminTools, {}, { role: "admin" });
}

describe("AdminTools", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getActiveCompetitions.mockReturnValue(apiResponse([mockCompetitions[0]]));
    getExpiredCompetitions.mockReturnValue(apiResponse([mockCompetitions[1]]));
  });

  it("should populate the dropdown with active and expired competitions", async () => {
    await act(async () => renderComponent());
    expect(screen.queryByText("World Cup 2026 (WC2026)")).toBeInTheDocument();
    expect(screen.queryByText("World Cup 2022 (WC2022)")).toBeInTheDocument();
  });

  it("should default to the first competition in the dropdown", async () => {
    await act(async () => renderComponent());
    const select = screen.getByRole("combobox");
    expect(select.value).toBe("WC2026");
  });

  it("should call calculateCompetition with the selected code on click", async () => {
    calculateCompetition.mockReturnValue(apiResponse("ok"));
    await act(async () => renderComponent());
    await act(async () => clickByText("Calculate"));
    expect(calculateCompetition).toHaveBeenCalledWith("WC2026");
  });

  it("should show a success toast on successful calculation", async () => {
    calculateCompetition.mockReturnValue(apiResponse("ok"));
    await act(async () => renderComponent());
    await act(async () => clickByText("Calculate"));
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show an error toast and StatusNote on failed calculation", async () => {
    calculateCompetition.mockReturnValue(apiResponse("Calculation failed", 500));
    await act(async () => renderComponent());
    await act(async () => clickByText("Calculate"));
    expect(toast.error).toHaveBeenCalled();
    expect(screen.queryByText(/error/i)).toBeInTheDocument();
    expect(screen.queryByText("Calculation failed")).toBeInTheDocument();
  });

  it("should not show the error StatusNote after a successful calculation", async () => {
    calculateCompetition.mockReturnValue(apiResponse("ok"));
    await act(async () => renderComponent());
    await act(async () => clickByText("Calculate"));
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("should show a fallback option if both competition fetches fail", async () => {
    getActiveCompetitions.mockReturnValue(apiResponse([], 500));
    getExpiredCompetitions.mockReturnValue(apiResponse([], 500));
    await act(async () => renderComponent());
    expect(screen.queryByText("No competitions found")).toBeInTheDocument();
  });

  describe("completed competition confirm", () => {
    beforeEach(() => {
      getActiveCompetitions.mockReturnValue(apiResponse([]));
      getExpiredCompetitions.mockReturnValue(apiResponse([mockCompetitions[1]]));
    });

    it("should show a confirm modal instead of calculating immediately", async () => {
      await act(async () => renderComponent());
      await act(async () => clickByText("Calculate"));
      expect(calculateCompetition).not.toHaveBeenCalled();
      expect(screen.queryByText("Competition Complete")).toBeInTheDocument();
      expect(screen.queryByText(/has already ended/)).toBeInTheDocument();
    });

    it("should not calculate if the confirm is cancelled", async () => {
      await act(async () => renderComponent());
      await act(async () => clickByText("Calculate"));
      await act(async () => clickByText("Cancel"));
      expect(calculateCompetition).not.toHaveBeenCalled();
    });

    it("should calculate after confirming", async () => {
      calculateCompetition.mockReturnValue(apiResponse("ok"));
      await act(async () => renderComponent());
      await act(async () => clickByText("Calculate"));
      await act(async () => clickByText("Calculate", 1));
      expect(calculateCompetition).toHaveBeenCalledWith("WC2022");
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
