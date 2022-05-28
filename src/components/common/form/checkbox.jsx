import React from "react";

const Checkbox = ({ label, value, onChange }) => {
  return (
    <div className="custom-form-switch">
      {label}
      <br />
      <label className="switch">
        <input
          type="checkbox"
          onChange={(event) => onChange(event)}
          checked={value}
        />
        <span className="slider" data-testid="custom-switch"></span>
      </label>
    </div>
  );
};

export default Checkbox;
