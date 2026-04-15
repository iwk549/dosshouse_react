import React from "react";
import IconRender from "../icons/iconRender";

const SearchBox = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-bar">
      <span className="search-bar-icon">
        <IconRender type="search" size={14} />
      </span>
      <input
        type="text"
        name="query"
        className="custom-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
};

export default SearchBox;
