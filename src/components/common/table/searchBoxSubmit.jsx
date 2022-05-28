import React, { useState, useEffect } from "react";
import Input from "../form/input";
import IconRender from "../icons/iconRender";

const SearchBoxSubmit = ({ name, onSearch, placeholder }) => {
  const [value, setValue] = useState("");
  const escFunction = (e) => {
    if (e.keyCode === 27) {
      setValue("");
      onSearch("");
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
      >
        <Input
          name={name}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
      </form>
      <button className="btn btn-dark btn-sm" onClick={() => onSearch(value)}>
        <IconRender type="search" />
      </button>
    </>
  );
};

export default SearchBoxSubmit;
