import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

// Single Select Tag Component
export function SingleSelectTag({
  value = null,
  onChange,
  options = [],
  placeholder,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border px-3 py-2 rounded cursor-pointer w-full h-10 flex items-center gap-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {value ? (
          <span
            className="flex items-center gap-2 px-2 py-1 rounded bg-blue-100 text-blue-700"
            style={{
              borderColor: value.color,
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: "6px",
              borderWidth: "2px",
            }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: value.color }}
            ></span>
            {value.value}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg w-full max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => handleSelect(option)}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: option.color }}
              ></span>
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Multiple Select Tags Component
export function MultipleSelectTags({
  value = [],
  onChange,
  options = [],
  placeholder,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ensure value is always an array
  const tags = Array.isArray(value) ? value : [];

  const handleAddTag = (tag) => {
    if (!tags.some((t) => t.id === tag.id)) {
      onChange([...tags, tag]);
    }
    setInputValue("");
  };

  const handleRemoveTag = (tag) => {
    onChange(tags.filter((item) => item.id !== tag.id));
  };

  const filteredOptions = options.filter(
    (option) =>
      !tags.some((tag) => tag.id === option.id) &&
      option.value.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-2 border p-1.5 rounded">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center"
          >
            {tag.value}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-red-500 rounded hover:bg-red-100"
              aria-label="Remove tag"
            >
              <X size={16} /> {/* Using the cross icon */}
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          className="flex-1 outline-none min-w-[120px] min-h-[26px]"
        />
      </div>
      {isDropdownOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg w-full max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAddTag(option)}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
