import React from "react";
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
} from "../../services/userService";
import LoadingContext from "../../context/loadingContext";
import { titleCase } from "../../utils/allowables";
import cookies from "../../services/cookieService";
import CookieBanner from "../common/pageSections/cookieBanner";

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
    cookiesAccepted: false,
  };

  checkCookieAcceptance = () => {
    const accepted = cookies.getCookie(cookies.acceptedName);
    if (accepted) this.setState({ cookiesAccepted: true });
  };

  componentDidMount() {
    this.checkCookieAcceptance();
  }

  schema = {
    name: Joi.string().allow("").min(1).max(50).label("Name"),
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(100).label("Password"),
  };
  tabs = this.props.reset ? ["Reset"] : ["Register", "Login"];

  setSelectedTab = (selectedTab) => {
    this.setState({ selectedTab });
  };

  handleCookieRejection = () => {
    this.props.setIsOpen(false);
    toast.info("You must accept cookies to be able to log in or register");
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
          {!this.state.cookiesAccepted ? (
            <CookieBanner
              rejectionCallback={this.handleCookieRejection}
              acceptanceCallback={this.checkCookieAcceptance}
              inModal={true}
              resetOnRejection={true}
              headerText="You must accept cookies in order to log in"
            />
          ) : (
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
                  {this.renderValidatedButton(
                    titleCase(this.state.selectedTab)
                  )}
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
          )}
        </BasicModal>
      </>
    );
  }
}

export default RegistrationModalForm;
