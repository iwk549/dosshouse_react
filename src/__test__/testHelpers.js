import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import LoadingContext from "../context/loadingContext";

export function renderWithContext(Component, props, user, path = "/") {
  return render(
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
}

export function apiResponse(data, status = 200) {
  return {
    status,
    data,
  };
}
