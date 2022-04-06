import React, { useState, useEffect, useContext, useRef } from "react";
import OutsideClickHandler from "react-outside-click-handler";

import IconRender from "../icons/iconRender";
import Tooltip from "../tooltip/tooltip";

const Select = ({
  name,
  label,
  options,
  selectedOption,
  onChange,
  placeholder,
  boldHeader,
  hideLabel,
  style,
  valueBoxStyle,
  tooltip,
}) => {
  const finalLabel = boldHeader ? <b>{label}</b> : label;

  const renderLabel = () => {
    return (
      <label htmlFor={name} className="custom-input-label">
        {tooltip ? (
          <Tooltip direction={tooltip.direction} content={tooltip.content}>
            {finalLabel}
          </Tooltip>
        ) : (
          <>
            {finalLabel}
            <br />
          </>
        )}
      </label>
    );
  };
  return (
    <div className="form-group">
      {renderLabel()}
      <select
        name={name}
        onChange={(event) => onChange(event.target.value)}
        className="custom-select"
        value={selectedOption}
      >
        <option value="" id="">
          {placeholder || "Make a selection..."}
        </option>
        {options.map((o) => (
          <option value={o.value} id={o.value} key={o._id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
