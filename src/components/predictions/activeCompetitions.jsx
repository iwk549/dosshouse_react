import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { shortDate } from "../../utils/allowables";

const ActiveCompetitions = ({ competitions }) => {
  let navigate = useNavigate();

  return competitions.map((c) => (
    <React.Fragment key={c._id}>
      <h3>{c.name}</h3>
      <div className="row">
        <div className="col">
          <p>
            Submission Deadline: <b>{shortDate(c.deadline)}</b>
            <br />
            <br />
            Submissions Allowed: <b>{c.maxSubmissions}</b>
          </p>
        </div>
        <div className="col">
          <button
            className="btn btn-dark"
            onClick={() => navigate(`/predictions?id=new&bracketCode=${c._id}`)}
          >
            Start New Submission
          </button>
        </div>
        <hr />
      </div>
    </React.Fragment>
  ));
};

export default ActiveCompetitions;
