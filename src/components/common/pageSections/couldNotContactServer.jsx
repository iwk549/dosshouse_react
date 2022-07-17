import React from "react";
import Header from "./header";

const CouldNotContactServer = () => {
  return (
    <div>
      <Header text="Could not contact server" />
      <button
        className="btn btn-block btn-info"
        onClick={() => window.location.reload(true)}
      >
        Try Again
      </button>
    </div>
  );
};

export default CouldNotContactServer;
