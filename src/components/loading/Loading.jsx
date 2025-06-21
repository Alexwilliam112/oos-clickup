export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
      <p className="text-sm">Loading, please wait...</p>
    </div>
  )
}
