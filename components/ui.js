// components/ui.js

import React from 'react';

export const Button = ({ className, children, onClick }) => (
  <button 
    className={`py-2 px-4 rounded-md focus:outline-none ${className}`} 
    onClick={onClick}
  >
    {children}
  </button>
);

export const Card = ({ className, children }) => (
  <div className={`p-4 rounded-lg shadow-lg ${className}`}>{children}</div>
);

export const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);

export const Input = ({ value, onChange, placeholder }) => (
  <input
    className="w-full p-2 border border-gray-300 rounded-md mt-2"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700">{children}</label>
);

// Select and Option Components
export const Select = ({ value, onChange, children, className }) => (
  <select 
    value={value} 
    onChange={onChange} 
    className={`w-full p-2 border border-gray-300 rounded-md mt-2 ${className}`}
  >
    {children}
  </select>
);

export const Option = ({ value, children }) => (
  <option value={value}>{children}</option>
);
