export function CustomLegend({ payload }) {
  if (!payload || !payload.length) return null;

  return (
    <div className="grid grid-cols-3 gap-2 text-sm mt-5">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="w-3 h-3 block rounded-sm"
            style={{ backgroundColor: entry.color }}
          ></span>
          <span className="truncate">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}