import IconRender from "../icons/iconRender";
import { decideSortOrder } from "../../../utils/allowables";

// Sort mode: pass onSort, columns, sortColumn
// Filter mode: pass onFilter, options [{ label, value }], selectedValue
const PillSort = ({ onSort, columns, sortColumn, onFilter, options, selectedValue }) => {
  if (onFilter) {
    return (
      <div className="pill-group">
        {options.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            className={`pill-btn filter${selectedValue === value ? " active" : ""}`}
            onClick={() => onFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="pill-group">
      {columns.map((c) => {
        const isActive = sortColumn.path === c.path;
        return (
          <button
            key={c.path}
            type="button"
            className={`pill-btn${isActive ? " active" : ""}`}
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
