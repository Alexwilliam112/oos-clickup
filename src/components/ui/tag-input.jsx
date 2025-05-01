import { useState } from "react";

// Single Select Tag Component
export function SingleSelectTag({ value = "", onChange, options = [], placeholder }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="border p-2 rounded cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg w-full max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Multiple Select Tags Component
export function MultipleSelectTags({ value = [], onChange, options = [], placeholder }) {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ensure value is always an array
  const tags = Array.isArray(value) ? value : [];

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInputValue("");
    setIsDropdownOpen(false);
  };

  const handleRemoveTag = (tag) => {
    onChange(tags.filter((item) => item !== tag));
  };

  const filteredOptions = options.filter(
    (option) =>
      !tags.includes(option) &&
      String(option).toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2 border p-2 rounded">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-red-500"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          className="flex-1 outline-none min-w-[120px]"
        />
      </div>
      {isDropdownOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg w-full max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAddTag(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
