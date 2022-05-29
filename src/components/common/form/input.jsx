import React from "react";

const Input = ({ name, label, onChange, error, style, ...rest }) => {
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
        style={{ paddingLeft: 5, ...style }}
      />
      {error && <div className="form-input-error">{error}</div>}
    </div>
  );
};

export default Input;
