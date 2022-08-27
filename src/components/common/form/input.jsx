import React from "react";

const Input = ({ name, label, onChange, error, style, drillRef, ...rest }) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="custom-input-label">
          {label}
        </label>
      )}
      <br />
      <input
        onChange={onChange}
        name={name}
        id={name}
        className="custom-input"
        style={{ paddingLeft: 5, ...style }}
        ref={drillRef}
        {...rest}
      />
      {error && <div className="form-input-error">{error}</div>}
    </div>
  );
};

export default Input;
