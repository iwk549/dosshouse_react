import React from "react";
import { IconContext } from "react-icons";

import { titleCase } from "../../../utils/allowables";

const HorizontalTabs = ({ tabs, selectedTab, onSelectTab, icons }) => {
  return (
    <div className="bootstrap-wrapper">
      <div className="row">
        {tabs.map((t, idx) => {
          const icon = icons && icons[idx] ? icons[idx] : null;
          const isSelected = selectedTab === t;
          return (
            <IconContext.Provider
              key={idx}
              value={{
                className: "icon-tabs" + (isSelected ? "-selected" : ""),
              }}
            >
              <div className="col">
                <div
                  className={
                    "custom-tab h-tab" + (isSelected ? " selected" : "")
                  }
                  onClick={() => onSelectTab(t)}
                >
                  {icon}
                  {icon ? " " : ""}
                  {titleCase(t)}
                </div>
              </div>
            </IconContext.Provider>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalTabs;
