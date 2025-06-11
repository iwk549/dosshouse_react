import { MemoryRouter } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import App from "../App";
import {
  getActiveCompetitions,
  getExpiredCompetitions,
} from "../services/competitionService";
import { apiResponse } from "./testHelpers";
import { getCurrentUser, refreshUser } from "../services/userService";
jest.mock("../services/predictionsService");
jest.mock("../services/competitionService", () => ({
  getActiveCompetitions: jest.fn(),
  getExpiredCompetitions: jest.fn(),
}));
jest.mock("../services/userService", () => ({
  refreshUser: jest.fn(),
  getCurrentUser: jest.fn(),
}));

const renderWithProps = async (user = null) => {
  getActiveCompetitions.mockReturnValue(apiResponse([]));
  getExpiredCompetitions.mockReturnValue(apiResponse([]));
  getCurrentUser.mockReturnValue(user);
  refreshUser.mockReturnValue(apiResponse(user, user ? 200 : 400));

  await act(async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
};

describe("App", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should initialize at the competitions page", async () => {
    await renderWithProps();
    expect(screen.queryByText("Competitions")).toBeInTheDocument();
  });
  it("should render the cookie banner", async () => {
    await renderWithProps();
    expect(screen.queryByTestId("cookie_banner")).toBeInTheDocument();
  });
});
