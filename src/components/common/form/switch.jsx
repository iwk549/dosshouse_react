import React from "react";

const Switch = ({ value, onChange, label, name }) => {
  const handleChange = (event) => {
    onChange(!value, name);
  };

  return (
    <div className="text-center">
      {label}
      <br />
      <label className="switch">
        <input
          type="checkbox"
          onChange={(event) => handleChange(event)}
          checked={value}
        />
        <span className="slider" data-testid="custom-switch"></span>
      </label>
    </div>
  );
};

export default Switch;
