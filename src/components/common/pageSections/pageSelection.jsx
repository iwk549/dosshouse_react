import React, { useState, useEffect, useContext, useRef } from "react";
import IconRender from "../icons/iconRender";
import { IconContext } from "react-icons";

const PageSelection = ({
  totalCount,
  displayPerPage,
  pageNumber,
  onIncrementPage,
  onSelectPage,
}) => {
  const renderPageNumbers = (page) => {
    return new Array(Math.ceil(totalCount / displayPerPage))
      .fill("x")
      .map((p, idx) => {
        return (
          <div key={idx} className="page-navigation clickable">
            {idx + 1}
          </div>
        );
      });
  };

  return (
    <IconContext.Provider value={{ className: "page-navigation" }}>
      <div className="page-numbers">
        <div style={{ display: "inline" }}>
          <div className="page-navigation clickable">
            <IconRender type="left" size={30} />
          </div>
          {renderPageNumbers()}
          <div className="page-navigation clickable">
            <IconRender type="right" size={30} className="page-navigation" />
          </div>
        </div>
        <p>
          Displaying {displayPerPage} results of {totalCount}
        </p>
      </div>
    </IconContext.Provider>
  );
};

export default PageSelection;
