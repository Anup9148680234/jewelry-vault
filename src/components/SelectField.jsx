import React from 'react';

function SelectField({ label, value, onChange, options }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => {
          const valueText = Array.isArray(option) ? option[0] : option;
          const labelText = Array.isArray(option) ? option[1] : option;
          return (
            <option key={valueText} value={valueText}>
              {labelText}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export default SelectField;
