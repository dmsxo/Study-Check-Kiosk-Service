import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const KST = 'Asia/Seoul';

function CalendarUI() {
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const [currentDate, setCurrentDate] = useState(dayjs().tz(KST));
  const [year, month, day] = currentDate.format('YYYY-MM-DD').split('-');
  const startWeekDay = currentDate.startOf('month').day();
  const dayInMonth = currentDate.endOf('month').date();

  function renderDayContent(day) {}

  function renderCalendar() {
    let days = [];
    for (let day = 0; day < startWeekDay; day++) {
      days.push(<div key={`empty${day}`} />);
    }
    for (let day = 0; day < dayInMonth; day++) {
      days.push(
        <div key={`day${day}`} className="p-4 border border-slate-200 rounded-lg min-h-20">
          {day}
        </div>
      );
    }
    return days;
  }

  return (
    <>
      {/* header */}
      <div className="flex p-4">
        <button
          onClick={() => {
            setCurrentDate((pre) => dayjs(pre).subtract(1, 'month').startOf('month'));
          }}
        >
          <ChevronLeft />
        </button>
        <h3 className="flex-1 text-center text-xl font-bold">
          {year}년 {month}월
        </h3>
        <button
          onClick={() => {
            setCurrentDate((pre) => dayjs(pre).add(1, 'month').startOf('month'));
          }}
        >
          <ChevronRight />
        </button>
      </div>

      {/* week day header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={`text-center font-semibold text-sm py-2 ${
              idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
    </>
  );
}

export default CalendarUI;
