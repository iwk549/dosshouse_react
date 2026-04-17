import IconRender from "../icons/iconRender";
import { decideSortOrder } from "../../../utils/allowables";

const PillSort = ({ onSort, columns, sortColumn }) => {
  return (
    <div className="pill-sort">
      {columns.map((c) => {
        const isActive = sortColumn.path === c.path;
        return (
          <button
            key={c.path}
            type="button"
            className={`pill-sort-btn${isActive ? " active" : ""}`}
            onClick={() => onSort(decideSortOrder(sortColumn, c.path))}
          >
            {c.label}
            {isActive && (
              <IconRender
                type={sortColumn.order === "asc" ? "up" : "down"}
                size={11}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PillSort;
