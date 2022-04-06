import React, { useState, useEffect, useContext, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  FaGripLines,
  FaCaretSquareUp,
  FaCaretSquareDown,
} from "react-icons/fa";
import { IconContext } from "react-icons";

const DraggableTableRow = ({
  data,
  columns,
  onDrop,
  onReorder,
  type,
  position,
  isLocked,
  isLastRow,
  isDummy,
}) => {
  const [, drag] = useDrag(
    () => ({
      type,
      item: { data, position },
      collect: (monitor) => {
        if (isLocked) return;
        return {
          isDragging: !!monitor.isDragging,
        };
      },
    }),
    [position]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: type,
      drop: (item) => {
        if (isLocked) return;
        onDrop({ draggedItem: item, droppedOn: { data, position } });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [position]
  );

  const ref = useRef(null);
  const dragDrop = drag(drop(ref));

  const renderBlankHoverCell = (key) => {
    return <td style={{ height: 5 }} key={key} />;
  };

  const renderBlankTopCell = (key) => {
    return <td style={{ height: 5 }} key={key} />;
  };

  return (
    <IconContext.Provider value={{ className: "icon-md icon-info" }}>
      {!isDummy ? (
        <tr
          ref={isLocked ? null : dragDrop}
          className={"d-table-row" + (isLocked ? " locked" : "")}
        >
          {!isLocked ? (
            <td>
              {position > 0 && (
                <FaCaretSquareUp
                  onClick={() => onReorder(data, "up", position)}
                  className="clickable"
                />
              )}
              <br />
              {!isLastRow ? (
                <FaCaretSquareDown
                  onClick={() => onReorder(data, "down", position)}
                  className="clickable"
                />
              ) : (
                <br />
              )}
            </td>
          ) : null}
          {columns.map((c, idx) => (
            <td key={idx} className="d-table-cell">
              {c.content(data)}
            </td>
          ))}
          <td>
            <FaGripLines />
          </td>
        </tr>
      ) : (
        <tr
          ref={isLocked ? null : dragDrop}
          className={isOver ? "dark-bg" : "muted-bg"}
        >
          {renderBlankTopCell()}
          {columns.map((c, idx) => renderBlankTopCell(idx))}
          {renderBlankTopCell()}
        </tr>
      )}
      <tr className={isOver ? "dark-bg" : "muted-bg"}>
        {renderBlankHoverCell()}
        {columns.map((c, idx) => renderBlankHoverCell(idx))}
        {renderBlankHoverCell()}
      </tr>
    </IconContext.Provider>
  );
};

export default DraggableTableRow;
