import React from "react";

import { titleCase } from "../../../utils/allowables";
import rules from "../../../textMaps/rules";
import Scoring from "./scoring";
import SideBySideView from "../../common/pageSections/sideBySideView";

const Information = ({ competition }) => {
  const lists = {
    rules,
  };

  const renderItem = (item, idx) => {
    if (
      item.header.toLowerCase().includes("group") &&
      !competition.scoring.group
    )
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
    <SideBySideView
      Components={[
        Object.keys(lists).map((key, i) => (
          <div className="col" key={i}>
            <h3>
              <u>{titleCase(key)}</u>
            </h3>
            <ul className="custom-unordered-list">
              {lists[key].map((item, ii) => renderItem(item, ii))}
            </ul>
          </div>
        )),
        <Scoring
          key="scoring"
          competition={competition}
          renderItem={renderItem}
        />,
      ]}
    />
  );
};

export default Information;
