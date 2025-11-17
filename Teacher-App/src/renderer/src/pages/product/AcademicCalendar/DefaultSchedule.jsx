import LayoutContainer from '../../../components/UI/LayoutContainer';

function DefaultSchedule({ weeklySchedule, setWeeklySchedule }) {
  const weekDays = ['월', '화', '수', '목', '금'];

  const grades = [
    {
      id: 1,
      label: '1학년',
      activeColor: 'bg-blue-400',
      inactiveColor: 'bg-blue-100 border border-blue-500'
    },
    {
      id: 2,
      label: '2학년',
      activeColor: 'bg-orange-400',
      inactiveColor: 'bg-orange-100 border border-orange-500'
    },
    {
      id: 3,
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
    setWeeklySchedule((prev) => {
      const newSchedule = [...prev];
      const daySchedule = { ...newSchedule[dayIdx] };
      const periodArray = [...(daySchedule[period] || [])];

      if (periodArray.includes(grade)) {
        daySchedule[period] = periodArray.filter((g) => g !== grade);
      } else {
        daySchedule[period] = [...periodArray, grade].sort();
      }

      newSchedule[dayIdx] = daySchedule;
      return newSchedule;
    });
  };

  const isGradeActive = (dayIdx, period, grade) => {
    return weeklySchedule[dayIdx]?.[period]?.includes(grade) || false;
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
          {weeklySchedule.map(
            (schedule, idx) => (
              // idx === 6 || idx === 0 ? (
              //   <div key={idx} className="bg-gray-50 border border-slate-200 rounded-xl p-4">
              //     <label
              //       className={`block text-sm mb-1 ${idx === 0 ? 'text-red-500' : 'text-blue-500'}`}
              //     >
              //       {weekDays[idx]}
              //     </label>
              //   </div>
              // ) : (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-4 rounded-xl min-h-24 space-y-1"
              >
                <label className="block text-sm mb-1 text-gray-700">{weekDays[idx]}</label>
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    onClick={() => toggleGrade(idx, period.id, grade.id)}
                    className={`w-full h-3 rounded-2xl cursor-pointer transition-opacity ${
                      isGradeActive(idx, period.id, grade.id)
                        ? `${grade.activeColor} opacity-100`
                        : `${grade.inactiveColor} opacity-30`
                    }`}
                  />
                ))}
              </div>
            )
            // )
          )}
        </div>
      ))}
      {/* 범례 */}
      <div className="flex items-center gap-6 justify-end">
        {grades.map((grade) => (
          <div key={grade.id} className="flex items-center gap-2">
            <div className={`w-8 h-3 rounded-2xl ${grade.activeColor}`} />
            <span className="text-sm text-gray-700">{grade.label}</span>
          </div>
        ))}
      </div>
    </LayoutContainer>
  );
}

export default DefaultSchedule;
