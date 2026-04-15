import React, { useState, useEffect, useRef } from "react";
import IconRender from "../icons/iconRender";

const SearchBoxSubmit = ({ name, onSearch, placeholder }) => {
  const [value, setValue] = useState("");
  const debounceTimer = useRef(null);

  const resetSearch = () => {
    setValue("");
    onSearch("");
  };

  const escFunction = (e) => {
    if (e.keyCode === 27) {
      resetSearch();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onSearch(newValue);
    }, 400);
  };

  return (
    <form
      className="search-bar-submit"
      onSubmit={(event) => {
        event.preventDefault();
        clearTimeout(debounceTimer.current);
        onSearch(value);
      }}
    >
      <div className="search-input-wrap">
        <span className="search-bar-icon">
          <IconRender type="search" size={14} />
        </span>
        <input
          name={name}
          placeholder={placeholder}
          className="custom-input"
          onChange={handleChange}
          value={value}
        />
        {value && (
          <button
            type="button"
            className="search-bar-clear"
            onClick={resetSearch}
          >
            <IconRender type="cancel" size={14} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBoxSubmit;
