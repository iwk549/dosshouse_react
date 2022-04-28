import React from "react";

const Input = ({ name, label, onChange, error, debounceTimeout, ...rest }) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="custom-input-label">
          {label}
        </label>
      )}
      <br />
      <input
        {...rest}
        onChange={onChange}
        name={name}
        id={name}
        className="custom-input"
      />
      {error && <div className="form-input-error">{error}</div>}
    </div>
  );
};

export default Input;
