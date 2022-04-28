import React, { useState, useEffect, useContext, useRef } from "react";

const PageSelection = ({
  totalCount,
  displayPerPage,
  pageNumber,
  onClickCaret,
  onSelectPage,
  resultsSelectionArray,
  onUpdateResultsPerPage,
}) => {
  const totalPages = Math.ceil(totalCount / displayPerPage);
  const renderPageNumbers = () => {
    return new Array(totalPages).fill("x").map((p, idx) => {
      return (
        <div
          key={idx}
          className={
            "page-navigation clickable" +
            (idx + 1 === pageNumber ? " selected" : "")
          }
          onClick={() => onSelectPage(idx + 1)}
        >
          {idx + 1}
        </div>
      );
    });
  };

  return (
    <div className="page-numbers">
      <div style={{ display: "inline" }}>
        {pageNumber > 1 && (
          <div
            className={
              "page-navigation " + (pageNumber === 1 ? "disabled" : "clickable")
            }
            onClick={pageNumber === 1 ? null : () => onClickCaret(-1)}
          >
            <b>&#8592;</b>
          </div>
        )}
        {renderPageNumbers()}
        {pageNumber !== totalPages && (
          <div
            className={
              "page-navigation " +
              (pageNumber === totalPages ? "disabled" : "clickable")
            }
            onClick={pageNumber === totalPages ? null : () => onClickCaret(1)}
          >
            <b>&#8594;</b>
          </div>
        )}
      </div>
      <p>
        Displaying {displayPerPage > totalCount ? totalCount : displayPerPage}{" "}
        of {totalCount}
      </p>
      {resultsSelectionArray && (
        <>
          <p>
            <small>Showing {displayPerPage} Results per Page</small>
          </p>
          <div className="page-numbers">
            {resultsSelectionArray.map((r, idx) => (
              <div
                className={
                  "page-navigation " +
                  (displayPerPage === r ? "selected" : "clickable")
                }
                key={idx}
                onClick={
                  displayPerPage === r ? null : () => onUpdateResultsPerPage(r)
                }
              >
                {r}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PageSelection;
