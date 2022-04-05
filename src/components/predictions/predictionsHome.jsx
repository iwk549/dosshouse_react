import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Header from "../common/pageSections/header";
import LoadingContext from "../../context/loadingContext";
import TabbedArea from "../common/pageSections/tabbedArea";
import { getAvailableBrackets } from "../../services/matchesService";
import { shortDate } from "../../utils/allowables";

const PredictionsHome = () => {
  const { setLoading } = useContext(LoadingContext);
  let navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active Competitions");
  const tabs = ["active Competitions", "submitted Brackets"];

  const loadData = async () => {
    setLoading(true);
    const res = await getAvailableBrackets();
    if (res.status === 200) {
      setCompetitions(res.data);
    } else toast.error(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Header text="Predictions" />

      <TabbedArea
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        tabPlacement="top"
      >
        {selectedTab === "active Competitions" ? (
          <>
            {competitions.map((c) => (
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
                      onClick={() =>
                        navigate("/predictions?id=new&bracketCode=worldCup2022")
                      }
                    >
                      Start New Submission
                    </button>
                  </div>
                  <hr />
                </div>
              </React.Fragment>
            ))}
          </>
        ) : null}
      </TabbedArea>
    </div>
  );
};

export default PredictionsHome;
