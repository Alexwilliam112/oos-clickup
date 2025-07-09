'use client'

export default function FormSubmitted() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Form Submitted</h1>
        <p className="text-gray-700">Thank you! Your response has been successfully recorded.</p>
      </div>
    </div>
  );
}