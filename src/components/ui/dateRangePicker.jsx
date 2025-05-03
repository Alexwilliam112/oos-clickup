"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";

export function DateRangePicker({ value, onChange, placeholder = "Select date range" }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState(value || { from: null, to: null });
  const pickerRef = useRef(null);

  const handleDateChange = (range) => {
    const updatedRange = {
      from: range?.from || null,
      to: range?.to || null,
    };
    setDateRange(updatedRange);
    if (updatedRange.from && updatedRange.to) {
      onChange(updatedRange);
      setIsCalendarOpen(false); // Close calendar after both dates are selected
    }
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Input Field */}
      <div
        className="border p-2 rounded cursor-pointer w-full"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      >
        {dateRange.from && dateRange.to
          ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
          : <span className="text-gray-400">{placeholder}</span>}
      </div>

      {/* Calendar */}
      {isCalendarOpen && (
        <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateChange}
          />
        </div>
      )}
    </div>
  );
}