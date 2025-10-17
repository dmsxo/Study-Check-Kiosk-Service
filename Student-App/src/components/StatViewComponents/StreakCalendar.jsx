import {
  generateMonthCalendar,
  getColorClass,
  getTextColor,
  nextMonth,
  prevMonth,
} from '../../helpers/calendar.helper';
import { CalendarHeader } from '../UIComponents';

function StreakCalendar({
  currentDate,
  setCurrentDate,
  setSelectedDate,
  attendanceCalendar,
}) {
  // 요일 배열
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 월별 달력 생성
  const calendar = generateMonthCalendar(attendanceCalendar, currentDate);

  return (
    <>
      <CalendarHeader
        prev={() => prevMonth(setCurrentDate)}
        next={() => nextMonth(setCurrentDate)}
        text={`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}
      />

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className="text-center text-xs text-gray-500 font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((day, dayIdx) => (
          <div key={dayIdx} className="aspect-square">
            {day ? (
              <button
                onClick={() => setSelectedDate(day)}
                className={`w-full h-full rounded border transition-all flex items-center justify-center ${getColorClass(
                  day.studytime
                )} ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <span
                  className={`text-xs font-medium ${getTextColor(
                    day.studytime
                  )}`}
                >
                  {day.date.split('-')[2]}
                </span>
              </button>
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-end gap-2 text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
        <span>적게</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <div className="w-3 h-3 bg-emerald-200 border border-emerald-300 rounded"></div>
          <div className="w-3 h-3 bg-emerald-400 border border-emerald-500 rounded"></div>
          <div className="w-3 h-3 bg-emerald-600 border border-emerald-700 rounded"></div>
          <div className="w-3 h-3 bg-emerald-800 border border-emerald-900 rounded"></div>
        </div>
        <span>많이</span>
      </div>
    </>
  );
}

export default StreakCalendar;
