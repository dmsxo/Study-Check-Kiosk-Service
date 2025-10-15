import { ChevronLeft, ChevronRight } from 'lucide-react';

function CalendarHeader({ prev, next, text }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button
        onClick={prev}
        className="p-1.5 hover:bg-gray-100 rounded transition"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      <h2 className="text-sm font-semibold text-gray-900">{text}</h2>

      <button
        onClick={next}
        className="p-1.5 hover:bg-gray-100 rounded transition"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

export default CalendarHeader;
