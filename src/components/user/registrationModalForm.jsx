import Joi from "joi-browser";
import { toast } from "react-toastify";
import TabbedArea from "react-tabbed-area";

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
  };

  schema = {
    name: Joi.string().allow("").min(1).max(50).label("Name"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(100).label("Password"),
  };
  tabs = this.props.reset ? ["Reset"] : ["Register", "Login"];

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
    this.setState({ selectedTab });
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
        this.state.data.password
      );
    if (res?.status === 200) {
      this.context.setUser();
      toast.success(
        type === "register" ? "Registration Successful" : "Logged In"
      );
      return this.props.onSuccess();
    } else toast.error(res?.data);
    this.context.setLoading(false);
  };

  handleResetRequest = async (event) => {
    event.preventDefault();
    if (!this.state.data.email)
      return toast.info("Enter your email address to request a password reset");
    this.context.setLoading(true);
    const res = await requestPasswordReset(this.state.data.email);
    if (res.status === 200) toast.success(res.data);
    else toast.error(res.data);
    this.context.setLoading(false);
  };

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
              <h4 className="text-center">{this.props.header}</h4>
            ) : (
              <>
                <br />
                <br />
              </>
            )
          }
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div id="googleBtn" />
          </div>
          <TabbedArea
            tabs={this.tabs}
            selectedTab={this.state.selectedTab}
            onSelectTab={this.setSelectedTab}
            tabPlacement="top"
          >
            <div className="text-center">
              <h3>
                {this.props.reset
                  ? "Reset your Password"
                  : this.state.selectedTab === "Register"
                  ? "Register for a New Account"
                  : "Login to your Account"}
              </h3>
              <form onSubmit={this.handleSubmit}>
                {this.state.selectedTab === "Register"
                  ? this.renderInput("name", "Name", "autofocus")
                  : null}
                {this.renderInput(
                  "email",
                  "Email",
                  this.state.selectedTab === "Login"
                )}
                {this.renderInput(
                  "password",
                  "Password",
                  this.state.reset ? "autofocus" : "",
                  "password"
                )}
                {this.renderValidatedButton(titleCase(this.state.selectedTab))}
                <br />
                <br />
                {this.state.selectedTab === "Login" && (
                  <>
                    <p>
                      Enter your email address and click the button below to
                      request a password reset
                    </p>
                    <button
                      className="btn btn-block btn-info"
                      onClick={this.handleResetRequest}
                    >
                      Forgot Password?
                    </button>
                  </>
                )}
              </form>
            </div>
          </TabbedArea>
        </BasicModal>
      </>
    );
  }
}

export default RegistrationModalForm;
