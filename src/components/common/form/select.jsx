import React, { useState, useEffect } from "react";
import Select from "react-select";

import Tooltip from "../tooltip/tooltip";

const FormSelect = ({
  name,
  label,
  options,
  selectedOption,
  onChange,
  boldHeader,
  tooltip,
  isLocked,
}) => {
  const [fullSelectedOption, setFullSelectedOption] = useState(null);

  useEffect(() => {
    setFullSelectedOption(options.find((o) => o.value === selectedOption));
  }, []);
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

  const raiseChange = (value) => {
    setFullSelectedOption(value);
    onChange(value.value);
  };

  return (
    <>
      {renderLabel()}
      <Select
        options={options}
        onChange={raiseChange}
        value={fullSelectedOption}
        isDisabled={isLocked}
      />
    </>
  );
};

export default FormSelect;
