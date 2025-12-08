import React, { useState, useRef, useEffect } from 'react';

const MultiSelect = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (option) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  const displayText = value.length > 0
    ? `${value.length} selected`
    : placeholder || 'Select...';

  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <div className="multi-select-wrapper" ref={dropdownRef}>
        <div
          className="multi-select-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{displayText}</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </div>
        {isOpen && (
          <div className="multi-select-dropdown">
            {options && options.map((option) => (
              <div
                key={option}
                className="multi-select-option"
                onClick={() => handleToggle(option)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={() => {}}
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
