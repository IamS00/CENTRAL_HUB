// Placeholder for filter components
// Will be implemented in Phase 3

export default function FilterBar() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            All Resources
          </span>
        </div>
        <button className="ml-auto text-sm text-gray-600 hover:text-primary">
          Clear all
        </button>
      </div>
    </div>
  );
}
