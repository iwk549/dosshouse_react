import React, { useState, useEffect } from "react";
import IconRender from "../icons/iconRender";

const SearchBoxSubmit = ({ name, onSearch, placeholder, hasSearched }) => {
  const [value, setValue] = useState("");

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

  return (
    <form
      style={{ display: "flex", alignItems: "center", gap: 6, width: "calc(100% - 24px)", maxWidth: 600, margin: "0 auto" }}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value);
      }}
    >
      {hasSearched && (
        <button
          type="button"
          className="btn btn-light btn-sm"
          onClick={resetSearch}
        >
          <IconRender type="cancel" />
        </button>
      )}
      <input
        name={name}
        placeholder={placeholder}
        className="custom-input"
        onChange={(event) => setValue(event.target.value)}
        value={value}
        style={{ flex: 1, width: "auto", marginBottom: 0 }}
      />
      <button type="submit" className="btn btn-dark btn-sm">
        <IconRender type="search" />
      </button>
    </form>
  );
};

export default SearchBoxSubmit;
