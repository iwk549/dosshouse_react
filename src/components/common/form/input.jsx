import React from "react";

const Input = ({ name, label, error, debounceTimeout, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="custom-input-label">
        {label}
      </label>
      <br />
      <input {...rest} name={name} id={name} className="custom-input" />
      {error && <div className="form-input-error">{error}</div>}
    </div>
  );
};

export default Input;
