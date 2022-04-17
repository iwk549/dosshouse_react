import React from "react";
import { DebounceInput } from "react-debounce-input";

const Input = ({ name, label, error, debounceTimeout, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="custom-input-label">
        {label}
      </label>
      <br />
      <DebounceInput
        debounceTimeout={debounceTimeout}
        {...rest}
        name={name}
        id={name}
        className="custom-input"
      />
      {error && <div className="form-input-error">{error}</div>}
    </div>
  );
};

export default Input;
