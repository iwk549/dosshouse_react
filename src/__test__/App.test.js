import { MemoryRouter } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import App from "../App";
import {
  getActiveCompetitions,
  getExpiredCompetitions,
} from "../services/competitionService";
import { apiResponse } from "./testHelpers";
import { getCurrentUser, refreshUser } from "../services/userService";
import { getLatestVersion } from "../services/versionsService";
import { mockHTMLContext } from "./mockHelpers";
jest.mock("../services/predictionsService");
jest.mock("../services/versionsService", () => ({
  getLatestVersion: jest.fn(),
}));
jest.mock("../services/competitionService", () => ({
  getActiveCompetitions: jest.fn(),
  getExpiredCompetitions: jest.fn(),
}));
jest.mock("../services/userService", () => ({
  refreshUser: jest.fn(),
  getCurrentUser: jest.fn(),
}));

const renderWithProps = async (
  user = null,
  version = {
    major: 1,
    minor: 0,
    patch: 0,
  }
) => {
  getActiveCompetitions.mockReturnValue(apiResponse([]));
  getExpiredCompetitions.mockReturnValue(apiResponse([]));
  getCurrentUser.mockReturnValue(user);
  refreshUser.mockReturnValue(apiResponse(user, user ? 200 : 400));
  getLatestVersion.mockReturnValue(
    apiResponse({
      major: 1,
      minor: 0,
      patch: 0,
      ...version,
    })
  );

  await act(async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
};

let reloadMock;
describe("App", () => {
  beforeEach(() => {
    reloadMock = mockHTMLContext().reloadMock;
    jest.resetAllMocks();
  });

  it("should reload the page if version doesn't match", async () => {
    await renderWithProps(null, { major: 0 });
    expect(reloadMock).toHaveBeenCalledTimes(1);
    expect(reloadMock).toHaveBeenCalledWith(true);
  });
  it("should initialize at the predictions page", async () => {
    await renderWithProps();
    expect(screen.queryByText("Predictions")).toBeInTheDocument();
  });
  it("should render the cookie banner", async () => {
    await renderWithProps();
    expect(screen.queryByTestId("cookie_banner")).toBeInTheDocument();
  });
});
