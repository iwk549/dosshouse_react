import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="centered-page-container">
          <div className="pop-box centered-page-box">
            <img
              src="assets/usb_p_logo.png"
              alt="Dosshouse logo"
              width={50}
              height={50}
              className="centered-page-logo"
            />
            <h2 className="centered-page-title">Something went wrong</h2>
            <p className="centered-page-message">
              An unexpected error occurred. Please refresh the page or try again
              later.
            </p>
            <div className="centered-page-actions">
              <button
                className="btn btn-md btn-dark"
                onClick={() => (window.location.href = "/")}
              >
                Go to Competitions
              </button>
              <button
                className="btn btn-md btn-info"
                onClick={() => window.location.reload()}
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
