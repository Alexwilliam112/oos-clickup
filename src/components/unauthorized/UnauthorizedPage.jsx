export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600">401</h1>
        <p className="mt-4 text-lg text-gray-600">Unauthorized Access</p>
        <p className="text-sm text-gray-500">You must be logged in to view this page.</p>
      </div>
    </div>
  );
}
