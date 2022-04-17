import React, { useEffect } from "react";
import Input from "../form/input";

const SearchBox = ({ name, search, onSearch, placeholder }) => {
  const escFunction = (e) => {
    if (e.keyCode === 27) onSearch("");
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <Input
      name={name}
      placeholder={placeholder}
      onChange={(event) => onSearch(event.target.value)}
      value={search}
      debounceTimeout={2000}
    />
  );
};

export default SearchBox;
