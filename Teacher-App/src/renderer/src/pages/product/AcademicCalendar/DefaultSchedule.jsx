import { useState } from 'react';
import LayoutContainer from '../../../components/UI/LayoutContainer';

function DefaultSchedule({ weeklySchedule, setWeeklySchedule }) {
  const weekDays = ['MON', 'TUES', 'WED', 'THUR', 'FRI']; // 키 이름으로 변경
  const displayWeekDays = ['월', '화', '수', '목', '금']; // 화면에 표시할 이름

  const [isChanged, setIsChanged] = useState(false);

  const grades = [
    {
      id: 1,
      key: 'grade1',
      label: '1학년',
      activeColor: 'bg-blue-400',
      inactiveColor: 'bg-blue-100 border border-blue-500'
    },
    {
      id: 2,
      key: 'grade2',
      label: '2학년',
      activeColor: 'bg-orange-400',
      inactiveColor: 'bg-orange-100 border border-orange-500'
    },
    {
      id: 3,
      key: 'grade3',
      label: '3학년',
      activeColor: 'bg-emerald-400',
      inactiveColor: 'bg-emerald-100 border border-emerald-500'
    }
  ];

  const periods = [
    {
      id: 'morning',
      label: '아침 독서',
      borderColor: 'border-amber-100',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      id: 'night',
      label: '야간 자율',
      borderColor: 'border-purple-50',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  const toggleGrade = (dayIdx, period, grade) => {
    setIsChanged(true);
    const dayKey = weekDays[dayIdx];
    setWeeklySchedule((prev) => {
      const newSchedule = { ...prev };
      const daySchedule = { ...newSchedule[dayKey] };

      const periodSchedule = { ...daySchedule[period] };
      periodSchedule[grade.key] = !periodSchedule[grade.key]; // 토글

      daySchedule[period] = periodSchedule;
      newSchedule[dayKey] = daySchedule;

      return newSchedule;
    });

    console.log(weeklySchedule);
  };

  const isGradeActive = (dayIdx, period, grade) => {
    const dayKey = weekDays[dayIdx];
    return weeklySchedule[dayKey]?.[period]?.[grade.key] || false;
  };

  return (
    <LayoutContainer className="mb-5 space-y-5 flex-6 min-w-lg">
      <h2 className="font-semibold text-2xl">요일별 기본 운영</h2>

      {periods.map((period) => (
        <div key={period.id} className="grid grid-cols-6 gap-2">
          <div
            className={`flex items-center justify-center whitespace-nowrap text-sm font-semibol text-center font-semibold border ${period.borderColor} ${period.bgColor} rounded-xl ${period.textColor}`}
          >
            {period.label}
          </div>
          {weekDays.map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 p-4 rounded-xl min-h-24 space-y-1"
            >
              <label className="block text-sm mb-1 text-gray-700">{displayWeekDays[idx]}</label>
              {grades.map((grade) => (
                <div
                  key={grade.id}
                  onClick={() => toggleGrade(idx, period.id, grade)}
                  className={`w-full h-3 rounded-2xl cursor-pointer transition-opacity ${
                    isGradeActive(idx, period.id, grade)
                      ? `${grade.activeColor} opacity-100`
                      : `${grade.inactiveColor} opacity-30`
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      <div className="flex items-center gap-6 justify-end">
        {grades.map((grade) => (
          <div key={grade.id} className="flex items-center gap-2">
            <div className={`w-8 h-3 rounded-2xl ${grade.activeColor}`} />
            <span className="text-sm text-gray-700">{grade.label}</span>
          </div>
        ))}
      </div>

      <button
        className={`w-full ${isChanged ? 'bg-gray-900' : 'bg-gray-400'} text-white rounded-xl p-2`}
      >
        저장하기
      </button>
    </LayoutContainer>
  );
}

export default DefaultSchedule;
