import { MemoryRouter } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import LoadingContext from "../context/loadingContext";

let mockNav = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNav,
  };
});

export function renderWithContext(Component, props, user, path = "/") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <LoadingContext.Provider
        value={{
          loading: false,
          setLoading: jest.fn(),
          user,
        }}
      >
        <Component {...props} />
      </LoadingContext.Provider>
    </MemoryRouter>
  );
  return { navMock: mockNav };
}

export function apiResponse(data, status = 200) {
  return {
    status,
    data,
  };
}

export async function clickByText(text, index = 0, isTestID = false) {
  const elem = isTestID
    ? screen.queryAllByTestId(text)
    : screen.queryAllByText(text);
  if (!elem[index])
    throw new Error(`Element with text ${text} at index ${index} not found`);
  await act(async () => {
    await fireEvent.click(elem[index]);
  });
}

export function changeText(inputLabel, text, index = 0, byRole) {
  const inputs = byRole
    ? screen.queryAllByRole("textbox", { name: inputLabel })
    : screen.queryAllByLabelText(inputLabel);
  if (!inputs[index]) throw new Error(`Input labeled ${inputLabel} not found`);
  fireEvent.change(inputs[index], { target: { value: text } });
}
