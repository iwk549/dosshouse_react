import Joi from "joi-browser";
import { toast } from "react-toastify";
import SegmentedControl from "../common/pageSections/segmentedControl";
import StatusNote from "../common/pageSections/statusNote";

import Form from "../common/form/form";
import BasicModal from "../common/modal/basicModal";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  updatePassword,
  loginWithGoogle,
} from "../../services/userService";
import LoadingContext from "../../context/loadingContext";
import { titleCase } from "../../utils/allowables";

class RegistrationModalForm extends Form {
  static contextType = LoadingContext;
  state = {
    data: {
      name: "",
      email: this.props.reset?.email || "",
      password: "",
    },
    errors: {},
    selectedTab: titleCase(this.props.selectedTab) || "Register",
    resetCooldown: 0,
    resetRequested: false,
  };

  schema = {
    name: Joi.string().allow("").min(1).max(50).label("Name"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(100).label("Password"),
  };
  tabs = this.props.reset ? ["Reset"] : ["Register", "Login", "Forgot"];

  constructor(props) {
    super(props);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isOpen || this.props.isOpen === prevProps.isOpen) return;

    const interval = setInterval(() => {
      const el = document.getElementById("googleBtn");

      if (el && window.google) {
        clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id:
            "425053581926-gnr5vl5sug2ai8iaed9onftce70bp4cd.apps.googleusercontent.com",
          callback: this.handleGoogleLogin,
        });

        window.google.accounts.id.renderButton(el, {
          theme: "filled_blue",
          size: "medium",
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }

  setSelectedTab = (selectedTab) => {
    this.setState({ selectedTab }, () => {
      const focusName = { Register: "name", Login: "email", Forgot: "email" };
      const el = document.querySelector(`[name="${focusName[selectedTab]}"]`);
      if (el) el.focus();
    });
  };

  doSubmit = async () => {
    this.context.setLoading(true);
    let res;
    const type = this.state.selectedTab.toLowerCase();
    if (type === "register") res = await registerUser(this.state.data);
    else if (type === "login") res = await loginUser(this.state.data);
    else if (type === "reset")
      res = await updatePassword(
        this.props.reset.token,
        this.state.data.email,
        this.state.data.password,
      );
    if (res?.status === 200) {
      this.context.setUser();
      toast.success(
        type === "register"
          ? "Registration Successful"
          : type === "reset"
            ? "Password Changed"
            : "Logged In",
      );
      return this.props.onSuccess();
    } else toast.error(res?.data);
    this.context.setLoading(false);
  };

  handleResetRequest = async (event) => {
    event.preventDefault();
    if (this.validateProperty({ name: "email", value: this.state.data.email }))
      return toast.info(
        "Enter a valid email address to request a password reset",
      );
    this.setState({ resetRequested: false });
    this.context.setLoading(true);
    const res = await requestPasswordReset(this.state.data.email);
    if (res.status === 200) {
      toast.success(res.data);
      this.setState({ resetRequested: true });
      this.startResetCooldown();
    } else toast.error(res.data);
    this.context.setLoading(false);
  };

  startResetCooldown = () => {
    this.setState({ resetCooldown: 45 });
    this._cooldownInterval = setInterval(() => {
      this.setState((prev) => {
        if (prev.resetCooldown <= 1) {
          clearInterval(this._cooldownInterval);
          return { resetCooldown: 0 };
        }
        return { resetCooldown: prev.resetCooldown - 1 };
      });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this._cooldownInterval);
  }

  async handleGoogleLogin(response) {
    this.context.setLoading(true);
    const idToken = response.credential;

    const res = await loginWithGoogle(idToken);
    if (res.status === 200) {
      this.context.setUser();
      return this.props.onSuccess();
    } else toast.error(res.data);
    this.context.setLoading(false);
  }

  render() {
    return (
      <>
        <BasicModal
          isOpen={this.props.isOpen}
          onClose={this.props.setIsOpen}
          hideClose={!this.props.setIsOpen}
          header={
            this.props.header ? (
              <div className="standout-header">{this.props.header}</div>
            ) : null
          }
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div id="googleBtn" />
          </div>
          <SegmentedControl
            tabs={this.tabs}
            selectedTab={this.state.selectedTab}
            onSelectTab={this.setSelectedTab}
          />
          <div className="text-center">
            <form onSubmit={this.handleSubmit} className="registration-form">
              {this.state.selectedTab === "Register"
                ? this.renderInput("name", "Name", "autofocus")
                : null}
              {this.renderInput(
                "email",
                "Email",
                this.state.selectedTab === "Login",
              )}
              {this.state.selectedTab !== "Forgot" &&
                this.renderInput(
                  "password",
                  this.state.selectedTab === "Reset"
                    ? "New Password"
                    : "Password",
                  this.props.reset ? "autofocus" : "",
                  "password",
                )}
              {this.state.selectedTab === "Login" && (
                <div className="forgot-link-row">
                  <span
                    className="view-switch-link"
                    onClick={() => this.setSelectedTab("Forgot")}
                  >
                    Forgot password?
                  </span>
                </div>
              )}
              {this.state.selectedTab === "Forgot" ? (
                <>
                  {this.state.resetRequested && (
                    <StatusNote>Password reset requested</StatusNote>
                  )}
                  <button
                    className="btn btn-info btn-top-margin"
                    onClick={this.handleResetRequest}
                    disabled={this.state.resetCooldown > 0}
                  >
                    {this.state.resetCooldown > 0
                      ? `Resend in ${this.state.resetCooldown}s`
                      : "Send Reset Email"}
                  </button>
                </>
              ) : (
                this.renderValidatedButton(
                  this.state.selectedTab === "Reset"
                    ? "Change Password"
                    : titleCase(this.state.selectedTab),
                  this.state.selectedTab !== "Login" ? "btn-top-margin" : "",
                )
              )}
            </form>
          </div>
        </BasicModal>
      </>
    );
  }
}

export default RegistrationModalForm;
