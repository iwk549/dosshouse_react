import React, { useState, useEffect, useContext, useRef } from "react";
import OutsideClickHandler from "react-outside-click-handler";

import IconRender from "../icons/iconRender";

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
}) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const finalLabel = boldHeader ? <b>{label}</b> : label;
  const handleSelect = (value, disabled) => {
    if (!disabled) {
      setSelectOpen(false);
      onChange(value);
    }
  };
  return (
    <div className="form-group">
      <label htmlFor={name} className="custom-input-label">
        {label}
      </label>
      <br />
      <select name={name}>
        <option value="" id=""></option>
        {options.map((o) => (
          <option value={o.value} id={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
