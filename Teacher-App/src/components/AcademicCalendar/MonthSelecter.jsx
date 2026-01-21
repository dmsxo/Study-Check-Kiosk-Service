import dayjs from 'dayjs';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function MonthSelecter({ selectedMonth, setSelectedMonth }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => {
          if (selectedMonth === null) setSelectedMonth(dayjs().tz('Asia/Seoul'));
          setIsOpen(!isOpen);
        }}
        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 flex items-center justify-between hover:border-gray-400 transition-colors duration-150"
      >
        <span className="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
          {selectedMonth ? `${selectedMonth.year()}년 ${selectedMonth.month() + 1}월` : '월 선택'}
        </span>
        <Calendar />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => setSelectedMonth((pre) => pre.subtract(1, 'year'))}
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-medium text-gray-700">{selectedMonth.year()}년</span>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => setSelectedMonth((pre) => pre.add(1, 'year'))}
            >
              <ChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((month, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedMonth(dayjs().year(selectedMonth.year()).month(idx));
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  selectedMonth.format('YYYYMM') ===
                  dayjs().year(selectedMonth.year()).month(idx).format('YYYYMM')
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthSelecter;
