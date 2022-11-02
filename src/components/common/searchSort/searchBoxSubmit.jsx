import React, { useState, useEffect } from "react";
import Input from "../form/input";
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
    <div style={{ position: "relative" }}>
      {hasSearched && (
        <button
          className="btn btn-light"
          style={{ position: "absolute", left: -10, top: "30%" }}
          onClick={resetSearch}
        >
          <IconRender type="cancel" />
        </button>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(value);
        }}
      >
        <Input
          name={name}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
        <button
          className="btn btn-dark"
          style={{ position: "absolute", top: "30%", right: -10 }}
        >
          <IconRender type="search" />
        </button>
      </form>
    </div>
  );
};

export default SearchBoxSubmit;
