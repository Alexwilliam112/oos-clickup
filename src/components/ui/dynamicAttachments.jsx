"use client";
import { useState, useRef } from "react";

const handleFileUpload = async (file) => {
  const reader = new FileReader();
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64Content = reader.result.split(",")[1];
        const response = await fetch(
          "https://api-oos.jojonomic.com/27414/clickup/v2/utils/file-upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file: base64Content,
              filename: file.name,
            }),
          }
        );

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

const DynamicFileAttachments = () => {
  const [fileFields, setFileFields] = useState([
    { id: Date.now(), file: null },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const inputRefs = useRef({}); // Store refs for each input field

  const addFileField = () => {
    const newField = { id: Date.now(), file: null };
    setFileFields((prevFields) => [...prevFields, newField]);
  };

  const removeFileField = (id) => {
    setFileFields((prevFields) =>
      prevFields.filter((field) => field.id !== id)
    );
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    delete inputRefs.current[id]; // Remove the ref for the deleted field
  };

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
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        { id, name: file.name, url },
      ]);
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium">Attachments</label>
      {uploadedFiles.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-4">
          {uploadedFiles.map((file) => (
            <li
              key={file.id}
              className="flex flex-col items-center gap-2 p-2 border rounded shadow-sm bg-white"
              style={{ width: "120px" }}
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-25 h-25 object-cover rounded"
              />
              <span className="text-sm text-gray-500 text-center truncate line-clamp-1">
                {file.name.length > 30
                  ? `${file.name.slice(0, 13)}...`
                  : file.name}
              </span>
            </li>
          ))}
        </ul>
      )}
      {uploadedFiles.length === 0 && <></>}

      {fileFields.map((field) => (
        <div key={field.id} className="flex items-center gap-2 mt-2">
          <input
            ref={(el) => (inputRefs.current[field.id] = el)} // Assign ref dynamically
            type="file"
            onChange={(e) => handleFileChange(field.id, e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="button"
            onClick={() => removeFileField(field.id)}
            className="text-red-500 hover:underline"
            disabled={fileFields.length === 1} // Prevent removing the last field
          >
            Remove
          </button>
        </div>
      ))}
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
