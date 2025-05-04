"use client";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique IDs

const handleFileUpload = async (file) => {
  const reader = new FileReader();
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64Content = reader.result.split(",")[1];
        const response = await fetch(`${baseUrl}/utils/file-upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: base64Content,
            filename: file.name,
          }),
        });

        const result = await response.json();
        if (result.code === 200 && !result.error) {
          resolve(result.data.url);
        } else {
          reject(new Error(result.message || "File upload failed"));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
};

const DynamicFileAttachments = ({ attachments, setAttachments }) => {
  const inputRefs = useRef({}); // Store refs for each input field

  // Add a new file field
  const addFileField = () => {
    const newAttachment = { id: uuidv4(), filename: "", url: "" }; // Use uuid for unique ID
    setAttachments((prevAttachments) => [...prevAttachments, newAttachment]);
  };

  // Remove a file field
  const removeFileField = (id) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((attachment) => attachment.id !== id)
    );
    delete inputRefs.current[id]; // Remove the ref for the deleted field
  };

  // Handle file input change
  const handleFileChange = async (id, file) => {
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

    if (file.size > MAX_FILE_SIZE) {
      console.error("File size exceeds 4MB:", file.name);
      alert(`The file "${file.name}" exceeds the 4MB size limit.`);
      if (inputRefs.current[id]) {
        inputRefs.current[id].value = ""; // Clear the input field
      }
      return;
    }

    try {
      const url = await handleFileUpload(file);
      setAttachments((prevAttachments) =>
        prevAttachments.map((attachment) =>
          attachment.id === id
            ? { ...attachment, filename: file.name, url }
            : attachment
        )
      );
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium">Attachments</label>

      {/* Display cards or input fields */}
      {attachments.map((file) => (
        <div key={file.id || uuidv4()} className="flex items-center gap-2 mt-2">
          {file.url ? (
            // Show card if file is uploaded
            <div
              className="flex flex-col items-center gap-2 p-2 border rounded shadow-sm bg-white"
              style={{ width: "120px" }}
            >
              <img
                src={file.url}
                alt={file.filename}
                className="w-25 h-25 object-cover rounded"
              />
              <span className="text-sm text-gray-500 text-center truncate line-clamp-1">
                {file.filename.length > 30
                  ? `${file.filename.slice(0, 13)}...`
                  : file.filename || "No File Selected"}
              </span>
              <button
                type="button"
                onClick={() => removeFileField(file.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            // Show input field if file is not uploaded
            <>
              <input
                ref={(el) => (inputRefs.current[file.id] = el)} // Assign ref dynamically
                type="file"
                onChange={(e) => handleFileChange(file.id, e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                type="button"
                onClick={() => removeFileField(file.id)}
                className="text-red-500 hover:underline"
                disabled={attachments.length === 1} // Prevent removing the last field
              >
                Remove
              </button>
            </>
          )}
        </div>
      ))}

      {/* Add more files button */}
      <button
        type="button"
        onClick={addFileField}
        className="mt-2 text-blue-500 hover:underline"
      >
        Add More Files
      </button>
    </div>
  );
};

export default DynamicFileAttachments;