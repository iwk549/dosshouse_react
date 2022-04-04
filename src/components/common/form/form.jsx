import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Checkbox from "./checkbox";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return this.state.disabled || null;
    const errors = {};
    for (let detail of error.details) errors[detail.path[0]] = detail.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = async ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors, apiError: null });

    if (input.name === "artistID") {
      if (input.value.length === 22) this.getArtistCB(input.value);
    }
  };

  renderValidatedButton(label) {
    return (
      <button
        name={label}
        disabled={this.validate()}
        className="btn btn-md btn-dark"
      >
        {label}
      </button>
    );
  }

  renderCancelButton(label) {
    return (
      <button
        name={label}
        className="btn btn-seconday"
        onClick={this.handleCancel}
      >
        {label}
      </button>
    );
  }

  renderResetButton(label) {
    return (
      <button
        name={label}
        className="btn btn-seconday"
        onClick={this.handleReset}
      >
        {label}
      </button>
    );
  }

  renderInput(
    name,
    label,
    autofocus = "",
    type = "text",
    disabled = "",
    max = ""
  ) {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        type={type}
        defaultValue={data[name]}
        label={label}
        onChange={this.handleChange}
        autoFocus={autofocus}
        error={errors[name]}
        disabled={disabled}
        max={max}
      />
    );
  }

  renderCheckbox(name, label) {
    const { data } = this.state;
    const onChange = (event) => {
      this.handleChange({
        currentTarget: {
          name,
          value: !data[name],
        },
      });
    };
    return (
      <Checkbox
        name={name}
        value={data[name]}
        onChange={onChange}
        label={label}
      />
    );
  }
}

export default Form;
