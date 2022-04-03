import React, { useState, useEffect, useContext, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableTableRow from "./draggableTableRow";

const DraggableTable = ({
  data,
  columns,
  onDrop,
  onReorder,
  type,
  isLocked,
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <table className="draggable-table">
        <tbody>
          <DraggableTableRow
            columns={columns}
            type={type}
            isDummy={true}
            onDrop={onDrop}
            team=""
            position={-1}
            isLocked={isLocked}
          />
          {data.map((d, idx) => (
            <DraggableTableRow
              key={idx}
              data={d}
              columns={columns}
              onDrop={onDrop}
              onReorder={onReorder}
              type={type}
              position={idx}
              isLastRow={idx === data.length - 1}
              isLocked={isLocked}
            />
          ))}
        </tbody>
      </table>
    </DndProvider>
  );
};

export default DraggableTable;
