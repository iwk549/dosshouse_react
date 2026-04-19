import { act, screen, within } from "@testing-library/react";
import RegistrationModalForm from "../../components/user/registrationModalForm";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  updatePassword,
} from "../../services/userService";
import { toast } from "react-toastify";
import {
  apiResponse,
  changeText,
  clickByText,
  renderWithContext,
} from "../testHelpers";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../../services/userService", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  requestPasswordReset: jest.fn(),
  updatePassword: jest.fn(),
  loginWithGoogle: jest.fn(),
}));

function renderComponent(props = {}) {
  const onSuccess = jest.fn();
  const { setUser } = renderWithContext(
    RegistrationModalForm,
    { isOpen: true, onSuccess, setIsOpen: jest.fn(), ...props },
    null,
  );
  return { setUser, onSuccess };
}

function getSubmitButton(name = "Register") {
  return within(document.querySelector("form")).getByRole("button", { name });
}

async function fillAndSubmit(
  email = "test@example.com",
  password = "Password123",
  buttonName = "Register",
) {
  changeText("Email", email);
  changeText("Password", password);
  await clickByText(buttonName, 1);
}

describe("RegistrationModalForm", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Rendering", () => {
    it("renders the Register tab by default with name, email, and password fields", () => {
      renderComponent();
      expect(screen.queryByLabelText("Name")).toBeInTheDocument();
      expect(screen.queryByLabelText("Email")).toBeInTheDocument();
      expect(screen.queryByLabelText("Password")).toBeInTheDocument();
      expect(getSubmitButton("Register")).toBeInTheDocument();
    });

    it("renders the Login tab without the name field", async () => {
      renderComponent();
      await clickByText("Login");
      expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Email")).toBeInTheDocument();
      expect(screen.queryByLabelText("Password")).toBeInTheDocument();
      expect(getSubmitButton("Login")).toBeInTheDocument();
    });

    it("renders the Forgot tab with only the email field and a send button", async () => {
      renderComponent();
      await clickByText("Forgot");
      expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Email")).toBeInTheDocument();
      expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
      expect(screen.queryByText("Send Reset Email")).toBeInTheDocument();
    });

    it("renders only a Reset tab when the reset prop is provided", () => {
      renderComponent({
        reset: { token: "abc123", email: "user@example.com" },
        selectedTab: "reset",
      });
      expect(
        screen.queryByRole("button", { name: "Register" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Login" }),
      ).not.toBeInTheDocument();
      expect(getSubmitButton("Change Password")).toBeInTheDocument();
    });

    it("pre-populates the email field from the reset prop", () => {
      renderComponent({
        reset: { token: "abc123", email: "user@example.com" },
        selectedTab: "reset",
      });
      expect(screen.getByLabelText("Email").value).toBe("user@example.com");
    });
  });

  describe("Tab switching", () => {
    it("shows the forgot password link on the Login tab", async () => {
      renderComponent();
      await clickByText("Login");
      expect(screen.queryByText("Forgot password?")).toBeInTheDocument();
    });

    it("switches to Forgot tab when clicking the forgot password link", async () => {
      renderComponent();
      await clickByText("Login");
      await clickByText("Forgot password?");
      expect(screen.queryByText("Send Reset Email")).toBeInTheDocument();
      expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    });
  });

  describe("Register flow", () => {
    it("calls registerUser with the typed form data", async () => {
      registerUser.mockResolvedValue(apiResponse("jwt-token"));
      renderComponent();
      await fillAndSubmit("newuser@example.com", "Password123");
      expect(registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "newuser@example.com",
          password: "Password123",
        }),
      );
    });

    it("calls setUser, shows success toast, and calls onSuccess on 200", async () => {
      registerUser.mockResolvedValue(apiResponse("jwt-token"));
      const { setUser, onSuccess } = renderComponent();
      await fillAndSubmit();
      expect(setUser).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Registration Successful");
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it("shows an error toast and does not call onSuccess on failure", async () => {
      registerUser.mockResolvedValue(apiResponse("Email already in use", 400));
      const { onSuccess } = renderComponent();
      await fillAndSubmit();
      expect(toast.error).toHaveBeenCalledWith("Email already in use");
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it("does not call registerUser if required fields are missing", async () => {
      renderComponent();
      await act(async () => {
        document
          .querySelector("form.registration-form")
          .dispatchEvent(new Event("submit", { bubbles: true }));
      });
      expect(registerUser).not.toHaveBeenCalled();
    });
  });

  describe("Login flow", () => {
    it("does not call loginUser if required fields are missing", async () => {
      renderComponent();
      await clickByText("Login");
      await act(async () => {
        document
          .querySelector("form.registration-form")
          .dispatchEvent(new Event("submit", { bubbles: true }));
      });
      expect(loginUser).not.toHaveBeenCalled();
    });


    it("calls loginUser with the typed form data", async () => {
      loginUser.mockResolvedValue(apiResponse("jwt-token"));
      renderComponent();
      await clickByText("Login");
      await fillAndSubmit("user@example.com", "Password123", "Login");
      expect(loginUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "user@example.com",
          password: "Password123",
        }),
      );
    });

    it("calls setUser, shows logged-in toast, and calls onSuccess on 200", async () => {
      loginUser.mockResolvedValue(apiResponse("jwt-token"));
      const { setUser, onSuccess } = renderComponent();
      await clickByText("Login");
      await fillAndSubmit("test@example.com", "Password123", "Login");
      expect(setUser).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Logged In");
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it("shows an error toast and does not call onSuccess on failure", async () => {
      loginUser.mockResolvedValue(
        apiResponse("Invalid email or password", 400),
      );
      const { onSuccess } = renderComponent();
      await clickByText("Login");
      await fillAndSubmit("test@example.com", "Password123", "Login");
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password");
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe("Forgot password flow", () => {
    beforeEach(async () => {
      renderComponent();
      await clickByText("Forgot");
    });

    it("shows an info toast if no email is entered before requesting reset", async () => {
      await clickByText("Send Reset Email");
      expect(toast.info).toHaveBeenCalledWith(
        expect.stringMatching(/valid email/i),
      );
      expect(requestPasswordReset).not.toHaveBeenCalled();
    });

    it("shows an info toast if an invalid email is entered before requesting reset", async () => {
      changeText("Email", "notanemail");
      await clickByText("Send Reset Email");
      expect(toast.info).toHaveBeenCalledWith(
        expect.stringMatching(/valid email/i),
      );
      expect(requestPasswordReset).not.toHaveBeenCalled();
    });

    it("calls requestPasswordReset with the entered email", async () => {
      requestPasswordReset.mockResolvedValue(
        apiResponse("An email will be sent..."),
      );
      changeText("Email", "user@example.com");
      await clickByText("Send Reset Email");
      expect(requestPasswordReset).toHaveBeenCalledWith("user@example.com");
    });

    it("shows a success toast on a successful reset request", async () => {
      const message = "An email will be sent if the account exists";
      requestPasswordReset.mockResolvedValue(apiResponse(message));
      changeText("Email", "user@example.com");
      await clickByText("Send Reset Email");
      expect(toast.success).toHaveBeenCalledWith(message);
    });

    it("shows an error toast on a failed reset request", async () => {
      requestPasswordReset.mockResolvedValue(
        apiResponse("Something went wrong", 400),
      );
      changeText("Email", "user@example.com");
      await clickByText("Send Reset Email");
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });

    it("shows a 'Password reset requested' note after a successful request", async () => {
      requestPasswordReset.mockResolvedValue(apiResponse("Success"));
      changeText("Email", "user@example.com");
      await clickByText("Send Reset Email");
      expect(screen.queryByText("Password reset requested")).toBeInTheDocument();
    });

    it("hides the note when the reset button is clicked again", async () => {
      jest.useFakeTimers();
      try {
        requestPasswordReset
          .mockResolvedValueOnce(apiResponse("Success"))
          .mockResolvedValueOnce(apiResponse("Something went wrong", 400));
        changeText("Email", "user@example.com");
        await clickByText("Send Reset Email");
        expect(screen.queryByText("Password reset requested")).toBeInTheDocument();
        act(() => jest.advanceTimersByTime(60000));
        await clickByText("Send Reset Email");
        expect(screen.queryByText("Password reset requested")).not.toBeInTheDocument();
      } finally {
        jest.useRealTimers();
      }
    });

    it("disables the Send Reset Email button and shows a countdown after sending", async () => {
      requestPasswordReset.mockResolvedValue(apiResponse("Success"));
      changeText("Email", "user@example.com");
      await clickByText("Send Reset Email");
      const btn = screen.queryByRole("button", { name: /resend in/i });
      expect(btn).toBeInTheDocument();
      expect(btn).toBeDisabled();
    });

    it("re-enables the Send Reset Email button after the cooldown expires", async () => {
      jest.useFakeTimers();
      try {
        requestPasswordReset.mockResolvedValue(apiResponse("Success"));
        changeText("Email", "user@example.com");
        await clickByText("Send Reset Email");
        act(() => jest.advanceTimersByTime(60000));
        expect(screen.queryByRole("button", { name: "Send Reset Email" })).not.toBeDisabled();
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe("Password reset flow", () => {
    function renderResetMode() {
      return renderComponent({
        reset: { token: "reset-token-xyz", email: "user@example.com" },
        selectedTab: "reset",
      });
    }

    it("calls updatePassword with the token, email, and new password", async () => {
      updatePassword.mockResolvedValue(apiResponse("jwt-token"));
      renderResetMode();
      changeText("New Password", "NewPassword1");
      await clickByText("Change Password");
      expect(updatePassword).toHaveBeenCalledWith(
        "reset-token-xyz",
        "user@example.com",
        "NewPassword1",
      );
    });

    it("calls setUser, shows success toast, and calls onSuccess on 200", async () => {
      updatePassword.mockResolvedValue(apiResponse("jwt-token"));
      const { setUser, onSuccess } = renderResetMode();
      changeText("New Password", "NewPassword1");
      await clickByText("Change Password");
      expect(setUser).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Password Changed");
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it("shows an error toast on failure", async () => {
      updatePassword.mockResolvedValue(apiResponse("Token expired", 400));
      renderResetMode();
      changeText("New Password", "NewPassword1");
      await clickByText("Change Password");
      expect(toast.error).toHaveBeenCalledWith("Token expired");
    });
  });
});
