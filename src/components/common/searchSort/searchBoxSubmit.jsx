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
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(value);
        }}
        style={{ position: "relative" }}
      >
        {hasSearched && (
          <div
            className="clickable"
            style={{ position: "absolute", left: "10%", top: "40%" }}
            onClick={resetSearch}
          >
            <IconRender type="cancel" />
          </div>
        )}
        <button
          className="btn btn-dark clickable"
          style={{ position: "absolute", top: "30%", right: 0 }}
        >
          <IconRender type="search" />
        </button>
        <Input
          name={name}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          value={value}
          style={{ paddingLeft: hasSearched ? "10%" : 0 }}
        />
      </form>
    </>
  );
};

export default SearchBoxSubmit;
