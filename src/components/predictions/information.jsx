import React, { useState, useEffect, useContext, useRef } from "react";

import { titleCase } from "../../utils/allowables";
import rules from "../../textMaps/rules";
import scoring from "../../textMaps/scoring";

const Information = ({ competition }) => {
  const lists = {
    rules,
    scoring,
  };

  const renderItem = (item, idx) => {
    if (item.header.toLowerCase().includes("group") && !competition.groupPicks)
      return null;
    return (
      <React.Fragment key={idx}>
        <li>
          <b>{item.header}</b>
        </li>
        {item.body}
      </React.Fragment>
    );
  };

  return (
    <div className="row">
      {Object.keys(lists).map((key, i) => (
        <div className="col" key={i}>
          <h3>
            <u>{titleCase(key)}</u>
          </h3>
          <ul className="custom-unordered-list">
            {lists[key].map((item, ii) => renderItem(item, ii))}
            {key === "scoring" && (
              <>
                <hr />
                <h3>
                  <u>Bonus Scoring</u>
                </h3>
                {competition.miscPicks.map((p, ii) =>
                  renderItem(
                    {
                      header: p.label,
                      body: <p>{p.points} points</p>,
                    },
                    ii
                  )
                )}
              </>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Information;
