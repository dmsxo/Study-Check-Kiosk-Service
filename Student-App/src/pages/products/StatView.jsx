import React from 'react';
import { useState } from 'react';
import {
  Calendar,
  Flame,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Percent,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function StatView() {
  // 현재 보고 있는 카테고리
  const [activeCategory, setActiveCategory] = useState('night');
  const categories = ['morning', 'night'];

  // 달력 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // 요일 배열
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 샘플 데이터 생성 (최근 6개월)
  const generateSampleData = () => {
    const data = {};
    const today = new Date();

    for (let i = 180; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      console.log(dateStr);

      if (Math.random() > 0.3) {
        data[dateStr] = Math.floor(Math.random() * 4) + 1;
      }
    }

    return data;
  };

  const [activityData] = useState(generateSampleData());

  // 월별 달력 생성
  const generateMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendar = [];
    let week = [];

    // 이전 달의 빈 칸
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];

      week.push({
        date: dateStr,
        day: day,
        level: activityData[dateStr] || 0,
        isToday: dateStr === new Date().toISOString().split('T')[0],
      });

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // 마지막 주의 빈 칸
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }

    return calendar;
  };

  const calendar = generateMonthCalendar();

  const getColorClass = (level) => {
    if (level === 0) return 'bg-gray-100 border-gray-200';
    if (level === 1) return 'bg-emerald-200 border-emerald-300';
    if (level === 2) return 'bg-emerald-400 border-emerald-500';
    if (level === 3) return 'bg-emerald-600 border-emerald-700';
    return 'bg-emerald-800 border-emerald-900';
  };

  const getTextColor = (level) => {
    if (level >= 3) return 'text-white';
    return 'text-gray-700';
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const currentData = [
    { month: '1월', rate: 85, total: 240, present: 204 },
    { month: '2월', rate: 88, total: 216, present: 190 },
    { month: '3월', rate: 92, total: 248, present: 228 },
    { month: '4월', rate: 87, total: 240, present: 209 },
    { month: '5월', rate: 90, total: 248, present: 223 },
    { month: '6월', rate: 89, total: 240, present: 214 },
    { month: '7월', rate: 91, total: 248, present: 226 },
    { month: '8월', rate: 86, total: 248, present: 213 },
    { month: '9월', rate: 93, total: 240, present: 223 },
    { month: '10월', rate: 94, total: 248, present: 233 },
  ];

  return (
    <div className="bg-gray-50 h-full">
      <div className="min-w-fit max-w-3xl p-4 space-y-3 ml-auto mr-auto">
        <h1 className="font-semibold text-gray-900 text-xl mb-4">출석 현황</h1>

        {/* 카테고리 선택 탭 */}
        <div className="relative bg-gray-100 rounded-xl p-1 flex">
          <div
            className="absolute top-1 bottom-1 bg-white rounded-lg shadow-md transition-all duration-300 ease-out"
            style={{
              left: `${
                (categories.indexOf(activeCategory) / categories.length) * 100
              }%`,
              width: `${100 / categories.length}%`,
              transform: 'translateX(0.25rem)',
            }}
          />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative z-10 flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeCategory === cat
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {cat === 'morning' && '아침 독서'}
              {cat === 'night' && '야간 자율 학습'}
            </button>
          ))}
        </div>
        {/* 개요 */}
        <div className="flex flex-col min-w-fit p-4 bg-white rounded-xl border border-slate-200">
          <h3 className="font-semibold text-gray-900 mb-2">개요</h3>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <div className="text-xs text-gray-600 font-medium">
                  연속 출석일
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">5</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                <div className="text-xs text-gray-600 font-medium">
                  최장 연속 출석일
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">10</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <div className="text-xs text-gray-600 font-medium">출석일</div>
              </div>
              <div className="text-xl font-bold text-gray-900">150</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Percent className="w-3.5 h-3.5 text-blue-500" />
                <div className="text-xs text-gray-600 font-medium">출석률</div>
              </div>
              <div className="text-xl font-bold text-gray-900">5</div>
            </div>
          </div>
        </div>

        {/* 달력 보기 */}
        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200">
          <h3 className="font-semibold text-gray-900 mb-2">출석 달력</h3>
          <div className="flex justify-center">
            <div className="flex-1 max-w-md min-w-3xs">
              {/* 달력 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-gray-100 rounded transition"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                <h2 className="text-sm font-semibold text-gray-900">
                  {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </h2>

                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-gray-100 rounded transition"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

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
              <div className="space-y-1">
                {calendar.map((week, weekIdx) => (
                  <div key={weekIdx} className="grid grid-cols-7 gap-1">
                    {week.map((day, dayIdx) => (
                      <div key={dayIdx} className="aspect-square">
                        {day ? (
                          <button
                            onClick={() => setSelectedDate(day)}
                            className={`w-full h-full rounded border transition-all flex items-center justify-center ${getColorClass(
                              day.level
                            )} ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
                            title={`${day.date}: Level ${day.level}`}
                          >
                            <span
                              className={`text-xs font-medium ${getTextColor(
                                day.level
                              )}`}
                            >
                              {day.day}
                            </span>
                          </button>
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    ))}
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
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="text-xs font-medium text-gray-500 mb-1">
              {selectedDate.date}
            </div>
            <div className="flex items-center gap-2">
              {selectedDate.level > 0 ? (
                <>
                  <span
                    className={`w-3 h-3 rounded border ${getColorClass(
                      selectedDate.level
                    )}`}
                  ></span>
                  <span className="text-sm text-gray-900 font-medium">
                    {selectedDate.level} contribution
                    {selectedDate.level > 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">No contributions</span>
              )}
            </div>
          </div>
        )}

        {/* 출석률 그래프 */}
        <div className="flex flex-col min-w-fit p-4 bg-white rounded-xl border border-slate-200">
          <h3 className="font-semibold text-gray-900 mb-2">출석률 추이</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={'month'}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                name="출석률 (%)"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StatView;
