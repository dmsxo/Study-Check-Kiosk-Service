import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sunrise, Moon, Calendar } from 'lucide-react';

const SelfStudyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGrades, setSelectedGrades] = useState(['1학년']);
  const [selectedTypes, setSelectedTypes] = useState(['아침']);
  const [schedule, setSchedule] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);

  const grades = ['1학년', '2학년', '3학년'];
  const types = ['아침', '야간'];

  const gradeColors = {
    '1학년': {
      morning: '#60A5FA',
      evening: '#3B82F6',
      light: '#DBEAFE',
      dot: 'bg-blue-500'
    },
    '2학년': {
      morning: '#FB923C',
      evening: '#F97316',
      light: '#FFEDD5',
      dot: 'bg-orange-500'
    },
    '3학년': {
      morning: '#34D399',
      evening: '#10B981',
      light: '#D1FAE5',
      dot: 'bg-green-500'
    }
  };

  const toggleGrade = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const monthNames = [
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
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const toggleDay = (day) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      selectedGrades.forEach((grade) => {
        selectedTypes.forEach((type) => {
          const key = `${year}-${month}-${day}-${grade}-${type}`;
          newSchedule[key] = !prev[key];
        });
      });
      return newSchedule;
    });
  };

  const getDaySchedule = (day) => {
    const morningGrades = [];
    const eveningGrades = [];

    grades.forEach((grade) => {
      const morningKey = `${year}-${month}-${day}-${grade}-아침`;
      const eveningKey = `${year}-${month}-${day}-${grade}-야간`;

      if (schedule[morningKey]) {
        morningGrades.push(grade);
      }
      if (schedule[eveningKey]) {
        eveningGrades.push(grade);
      }
    });

    return { morningGrades, eveningGrades };
  };

  const renderSegments = (gradesList, type) => {
    if (gradesList.length === 0) return null;

    const colorKey = type === '아침' ? 'morning' : 'evening';

    return (
      <div className="flex gap-0.5 flex-1">
        {gradesList.map((grade, idx) => (
          <div
            key={idx}
            className="flex-1 h-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: gradeColors[grade][colorKey] }}
          />
        ))}
      </div>
    );
  };

  const getMonthSummary = () => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const { morningGrades, eveningGrades } = getDaySchedule(day);
      if (morningGrades.length > 0 || eveningGrades.length > 0) count++;
    }
    return count;
  };

  const renderDayContent = (day) => {
    const { morningGrades, eveningGrades } = getDaySchedule(day);
    const isWeekend =
      (startingDayOfWeek + day - 1) % 7 === 0 || (startingDayOfWeek + day - 1) % 7 === 6;
    const hasSchedule = morningGrades.length > 0 || eveningGrades.length > 0;

    return (
      <button
        onClick={() => toggleDay(day)}
        onMouseEnter={() => setHoveredDay(day)}
        onMouseLeave={() => setHoveredDay(null)}
        className="w-full aspect-square rounded-xl transition-all relative overflow-visible hover:shadow-md"
        style={{
          backgroundColor: isWeekend ? '#f8fafc' : '#ffffff',
          border: hasSchedule ? '2px solid #e2e8f0' : '1px solid #e2e8f0'
        }}
      >
        <div className="absolute inset-0 flex flex-col p-2">
          <div className="text-left mb-auto">
            <span
              className={`text-sm font-semibold ${isWeekend && !hasSchedule ? 'text-gray-400' : 'text-gray-700'}`}
            >
              {day}
            </span>
          </div>

          <div className="space-y-1.5 mt-auto">
            {morningGrades.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Sunrise className="w-3 h-3 text-gray-400 shrink-0" />
                {renderSegments(morningGrades, '아침')}
              </div>
            )}

            {eveningGrades.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Moon className="w-3 h-3 text-gray-400 shrink-0" />
                {renderSegments(eveningGrades, '야간')}
              </div>
            )}
          </div>
        </div>

        {hoveredDay === day && hasSchedule && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-xl">
            <div className="space-y-2">
              {morningGrades.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sunrise className="w-3 h-3" />
                    <span className="font-semibold">아침</span>
                  </div>
                  <div className="pl-5 text-gray-300">{morningGrades.join(', ')}</div>
                </div>
              )}
              {eveningGrades.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Moon className="w-3 h-3" />
                    <span className="font-semibold">야간</span>
                  </div>
                  <div className="pl-5 text-gray-300">{eveningGrades.join(', ')}</div>
                </div>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </button>
    );
  };

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(<div key={day}>{renderDayContent(day)}</div>);
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900">자율학습 캘린더</h1>
          </div>
          <p className="text-gray-500 text-sm">학년별·시간대별 운영일 관리</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-semibold text-gray-700 mb-3">학년</label>
              <div className="flex gap-2">
                {grades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => toggleGrade(grade)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all"
                    style={{
                      backgroundColor: selectedGrades.includes(grade)
                        ? gradeColors[grade].morning
                        : gradeColors[grade].light,
                      color: selectedGrades.includes(grade)
                        ? '#ffffff'
                        : gradeColors[grade].morning,
                      border: selectedGrades.includes(grade)
                        ? 'none'
                        : `2px solid ${gradeColors[grade].morning}`
                    }}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-3">시간대</label>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleType('아침')}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: selectedTypes.includes('아침') ? '#f59e0b' : '#fef3c7',
                    color: selectedTypes.includes('아침') ? '#ffffff' : '#f59e0b',
                    border: selectedTypes.includes('아침') ? 'none' : '2px solid #f59e0b'
                  }}
                >
                  <Sunrise className="w-4 h-4" />
                  아침
                </button>
                <button
                  onClick={() => toggleType('야간')}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: selectedTypes.includes('야간') ? '#6366f1' : '#e0e7ff',
                    color: selectedTypes.includes('야간') ? '#ffffff' : '#6366f1',
                    border: selectedTypes.includes('야간') ? 'none' : '2px solid #6366f1'
                  }}
                >
                  <Moon className="w-4 h-4" />
                  야간
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {year}년 {monthNames[month]}
              </h2>
              <p className="text-sm text-gray-500 mt-1">운영일: {getMonthSummary()}일</p>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Week Days */}
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

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">범례</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">학년별 색상</p>
              <div className="flex gap-4">
                {grades.map((grade) => (
                  <div key={grade} className="flex items-center gap-2">
                    <div
                      className="w-12 h-3 rounded-full"
                      style={{ background: gradeColors[grade].morning }}
                    />
                    <span className="text-sm text-gray-700">{grade}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">시간대 (채도 차이)</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">아침 (밝은 톤)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">야간 (진한 톤)</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                💡 팁: 여러 학년이 함께 운영되면 세그먼트로 나눠서 표시됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfStudyCalendar;
