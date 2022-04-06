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
    return (
      <React.Fragment key={idx}>
        <li>
          <b>{item.header}</b>
        </li>
        {item.body}
        <br />
        <br />
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
                {competition.miscPicks.map((p) =>
                  renderItem({ header: p.label, body: p.points + " points" })
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
