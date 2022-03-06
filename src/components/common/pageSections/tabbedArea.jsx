import React from "react";

import VerticalTabs from "./verticalTabs";
import HorizontalTabs from "./horizontalTabs";

const TabbedArea = ({
  tabPlacement,
  tabs,
  icons,
  selectedTab,
  onSelectTab,
  contentClassName,
  children,
}) => {
  const TabType = tabPlacement === "top" ? HorizontalTabs : VerticalTabs;

  return (
    <div className="small-padding">
      <TabType
        tabs={tabs}
        selectedTab={selectedTab}
        onSelectTab={onSelectTab}
        side={tabPlacement}
        icons={icons}
      />
      <div
        className={
          "tab-area " +
          (tabPlacement === "top" ? "horizontal " : "vertical ") +
          tabPlacement +
          (contentClassName ? ` ${contentClassName}` : "")
        }
      >
        {children}
      </div>
    </div>
  );
};

export default TabbedArea;
