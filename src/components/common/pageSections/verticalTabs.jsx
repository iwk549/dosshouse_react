import React from "react";
import { IconContext } from "react-icons";

import { titleCase } from "../../../utils/allowables";

const VerticalTabs = ({ tabs, icons, selectedTab, onSelectTab, side }) => {
  return (
    <div style={{ float: side === "right" ? "right" : "left" }}>
      {tabs.map((t, idx) => {
        const icon = icons && icons[idx] ? icons[idx] : null;
        const isSelected = selectedTab === t;
        return (
          <IconContext.Provider
            key={idx}
            value={{
              className: "icon-tabs-vertical" + (isSelected ? "-selected" : ""),
            }}
          >
            <div
              className={
                " custom-tab " +
                (isSelected ? "selected" : "") +
                " v-tab v-tab-" +
                side
              }
              onClick={() => onSelectTab(t)}
            >
              &nbsp;
              {icon ? icon : titleCase(t)}&nbsp;
            </div>
          </IconContext.Provider>
        );
      })}
    </div>
  );
};

export default VerticalTabs;
