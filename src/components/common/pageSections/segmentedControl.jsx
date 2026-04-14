import { useRef, useState, useEffect } from "react";

const SegmentedControl = ({ tabs, selectedTab, onSelectTab }) => {
  const scrollRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
  }, [tabs]);

  return (
    <div className={`segmented-control-wrapper${atEnd ? " at-end" : ""}`}>
      <div
        className="segmented-control"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        {tabs.map((tab) => {
          const tabName = tab.name || tab;
          const isSelected = tabName === (selectedTab?.name || selectedTab);
          return (
            <button
              key={tabName}
              type="button"
              className={`underline-tab${isSelected ? " active" : ""}`}
              onClick={() => !isSelected && onSelectTab(tab)}
            >
              {tabName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedControl;
