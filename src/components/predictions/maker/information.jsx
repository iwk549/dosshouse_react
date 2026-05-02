import React from "react";

import { titleCase } from "../../../utils/allowables";
import rules from "../../../textMaps/rules";
import Scoring from "./scoring";
import SideBySideView from "../../common/pageSections/sideBySideView";
import ExternalLinks from "../../common/pageSections/externalLinks";

const Information = ({ competition }) => {
  const lists = {
    rules,
  };

  const renderItem = (item, idx) => {
    if (
      item.header.toLowerCase().includes("group") &&
      !competition?.scoring?.group
    )
      return null;
    return (
      <div className="info-section" key={idx}>
        <div className="info-section-label">{item.header}</div>
        <div className="info-section-body">{item.body}</div>
      </div>
    );
  };

  return (
    <>
      {competition?.links?.length > 0 && (
        <div className="information-links">
          <ExternalLinks links={competition.links} testId="information-links" />
        </div>
      )}
      <SideBySideView
        Components={[
          <Scoring
            key="scoring"
            competition={competition}
            renderItem={renderItem}
          />,
          Object.keys(lists).map((key, i) => (
            <div className="competition-card info-card info-card-compact" key={i}>
              <div className="competition-card-header">
                <h3>{titleCase(key)}</h3>
              </div>
              <div className="competition-card-body">
                {lists[key].map((item, ii) => renderItem(item, ii))}
              </div>
            </div>
          )),
        ]}
      />
    </>
  );
};

export default Information;
