import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

// 일정 편집 모달 컴포넌트
const ScheduleEditModal = ({ schedule, onSave, onClose }) => {
  const [editingSchedule, setEditingSchedule] = useState(schedule);
  const grades = [1, 2, 3];

  const addAdditionalApplication = () => {
    setEditingSchedule({
      ...editingSchedule,
      additionalApplications: [...editingSchedule.additionalApplications, { start: '', end: '' }]
    });
  };

  const removeAdditionalApplication = (index) => {
    setEditingSchedule({
      ...editingSchedule,
      additionalApplications: editingSchedule.additionalApplications.filter(
        (_, idx) => idx !== index
      )
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            일정 {schedule.id && schedule.semester ? '수정' : '추가'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">학기</label>
              <select
                value={editingSchedule.semester}
                onChange={(e) =>
                  setEditingSchedule({ ...editingSchedule, semester: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">선택</option>
                <option value="1학기">1학기</option>
                <option value="2학기">2학기</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">종류</label>
              <select
                value={editingSchedule.type}
                onChange={(e) => setEditingSchedule({ ...editingSchedule, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="아침독서">아침독서</option>
                <option value="야간 자율">야간 자율</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">대상 학년</label>
            <div className="flex gap-3">
              {grades.map((grade) => (
                <label key={grade} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSchedule.grades.includes(grade)}
                    onChange={(e) => {
                      const newGrades = e.target.checked
                        ? [...editingSchedule.grades, grade]
                        : editingSchedule.grades.filter((g) => g !== grade);
                      setEditingSchedule({ ...editingSchedule, grades: newGrades });
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{grade}학년</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">신청 시작일</label>
              <input
                type="date"
                value={editingSchedule.applicationStart}
                onChange={(e) =>
                  setEditingSchedule({ ...editingSchedule, applicationStart: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">신청 종료일</label>
              <input
                type="date"
                value={editingSchedule.applicationEnd}
                onChange={(e) =>
                  setEditingSchedule({ ...editingSchedule, applicationEnd: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">운영 시작일</label>
              <input
                type="date"
                value={editingSchedule.operationStart}
                onChange={(e) =>
                  setEditingSchedule({ ...editingSchedule, operationStart: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">운영 종료일</label>
              <input
                type="date"
                value={editingSchedule.operationEnd}
                onChange={(e) =>
                  setEditingSchedule({ ...editingSchedule, operationEnd: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">추가 신청 기간</label>
              <button
                onClick={addAdditionalApplication}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>
            {editingSchedule.additionalApplications.length > 0 ? (
              <div className="space-y-2">
                {editingSchedule.additionalApplications.map((app, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <input
                      type="date"
                      value={app.start}
                      onChange={(e) => {
                        const newApps = [...editingSchedule.additionalApplications];
                        newApps[idx].start = e.target.value;
                        setEditingSchedule({ ...editingSchedule, additionalApplications: newApps });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={app.end}
                      onChange={(e) => {
                        const newApps = [...editingSchedule.additionalApplications];
                        newApps[idx].end = e.target.value;
                        setEditingSchedule({ ...editingSchedule, additionalApplications: newApps });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeAdditionalApplication(idx)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                추가 신청 기간이 없습니다
              </p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
          >
            <X className="w-4 h-4" />
            취소
          </button>
          <button
            onClick={() => onSave(editingSchedule)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

// 일정 설정 컴포넌트
const ScheduleSettings = ({ schedules, setSchedules }) => {
  const [editingSchedule, setEditingSchedule] = useState(null);

  const addNewSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      semester: '',
      type: '야간 자율',
      grades: [],
      applicationStart: '',
      applicationEnd: '',
      operationStart: '',
      operationEnd: '',
      additionalApplications: []
    };
    setEditingSchedule(newSchedule);
  };

  const saveSchedule = (schedule) => {
    if (schedule.id && schedules.find((s) => s.id === schedule.id)) {
      setSchedules(schedules.map((s) => (s.id === schedule.id ? schedule : s)));
    } else {
      setSchedules([...schedules, schedule]);
    }
    setEditingSchedule(null);
  };

  const deleteSchedule = (id) => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">자율학습 일정 설정</h2>
              <p className="text-sm text-gray-600 mt-0.5">신청 기간과 운영 기간을 설정합니다</p>
            </div>
          </div>
          <button
            onClick={addNewSchedule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />새 일정 추가
          </button>
        </div>

        {schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{schedule.semester}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {schedule.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      대상: {schedule.grades.map((g) => `${g}학년`).join(', ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSchedule(schedule)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">신청 기간</p>
                    <p className="font-medium text-gray-900">
                      {schedule.applicationStart} ~ {schedule.applicationEnd}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">운영 기간</p>
                    <p className="font-medium text-gray-900">
                      {schedule.operationStart} ~ {schedule.operationEnd}
                    </p>
                  </div>
                </div>

                {schedule.additionalApplications.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">추가 신청 기간</p>
                    {schedule.additionalApplications.map((app, idx) => (
                      <p key={idx} className="text-sm font-medium text-gray-900">
                        {app.start} ~ {app.end}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">등록된 일정이 없습니다</p>
            <p className="text-sm text-gray-400">새 일정 추가 버튼을 눌러 일정을 생성하세요</p>
          </div>
        )}
      </div>

      {editingSchedule && (
        <ScheduleEditModal
          schedule={editingSchedule}
          onSave={saveSchedule}
          onClose={() => setEditingSchedule(null)}
        />
      )}
    </>
  );
};

// 예외 일정 편집 모달 컴포넌트
const OverrideEditModal = ({ override, onSave, onClose }) => {
  const [editingOverride, setEditingOverride] = useState(override);
  const grades = [1, 2, 3];
  const types = ['아침독서', '야간 자율'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-xl font-bold text-gray-900">
            예외 일정 {override.date ? '수정' : '추가'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
              <input
                type="date"
                value={editingOverride.date}
                onChange={(e) => setEditingOverride({ ...editingOverride, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
              <input
                type="text"
                value={editingOverride.reason}
                onChange={(e) => setEditingOverride({ ...editingOverride, reason: e.target.value })}
                placeholder="예: 중간고사, 수능일"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">해당 학년</label>
            <div className="flex gap-3">
              {grades.map((grade) => (
                <label key={grade} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOverride.grades.includes(grade)}
                    onChange={(e) => {
                      const newGrades = e.target.checked
                        ? [...editingOverride.grades, grade]
                        : editingOverride.grades.filter((g) => g !== grade);
                      setEditingOverride({ ...editingOverride, grades: newGrades });
                    }}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">{grade}학년</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              중단할 자율학습 종류
            </label>
            <div className="flex gap-3">
              {types.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOverride.types.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...editingOverride.types, type]
                        : editingOverride.types.filter((t) => t !== type);
                      setEditingOverride({ ...editingOverride, types: newTypes });
                    }}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
          >
            <X className="w-4 h-4" />
            취소
          </button>
          <button
            onClick={() => onSave(editingOverride)}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
const WeeklySchedule = ({ weeklySchedule, setWeeklySchedule }) => {
  const days = ['월', '화', '수', '목', '금'];
  const grades = [1, 2, 3];
  const types = [
    { key: '아침독서', label: '아침독서', icon: '🌅', color: 'orange' },
    { key: '야간 자율', label: '야간 자율', icon: '🌙', color: 'indigo' }
  ];

  const toggleWeeklySchedule = (day, grade, type) => {
    setWeeklySchedule((prev) => {
      const gradeKey = `grade${grade}`;
      const currentTypes = prev[day][gradeKey] || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type];

      return {
        ...prev,
        [day]: {
          ...prev[day],
          [gradeKey]: newTypes
        }
      };
    });
  };

  const isGradeActive = (day, grade, typeKey) => {
    const gradeKey = `grade${grade}`;
    const selectedTypes = weeklySchedule[day][gradeKey] || [];
    return selectedTypes.includes(typeKey);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-7 h-7 text-indigo-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">요일별 기본 운영</h2>
          <p className="text-sm text-gray-600 mt-0.5">
            각 요일별로 학년과 자율학습 종류를 설정합니다
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-200">
        {/* Calendar Grid */}
        <div className="grid grid-cols-[120px_repeat(5,1fr)] gap-3">
          {/* Header - Empty corner */}
          <div className=""></div>

          {/* Day Headers */}
          {days.map((day) => (
            <div key={day} className="text-center">
              <div className="bg-white rounded-lg py-3 shadow-sm border border-gray-200">
                <p className="text-base font-bold text-gray-900">{day}요일</p>
              </div>
            </div>
          ))}

          {/* Type Rows */}
          {types.map((type) => (
            <React.Fragment key={type.key}>
              {/* Type Label */}
              <div className="flex items-center justify-center">
                <div
                  className={`w-full h-full bg-gradient-to-r ${
                    type.color === 'orange'
                      ? 'from-orange-500 to-amber-500'
                      : 'from-indigo-600 to-purple-600'
                  } text-white rounded-lg py-4 shadow-sm flex items-center justify-center gap-2`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-bold text-sm">{type.label}</span>
                </div>
              </div>

              {/* Day Cells */}
              {days.map((day) => (
                <div key={day} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <div className="flex gap-1.5">
                    {grades.map((grade) => {
                      const isActive = isGradeActive(day, grade, type.key);
                      return (
                        <button
                          key={grade}
                          onClick={() => toggleWeeklySchedule(day, grade, type.key)}
                          className={`flex-1 h-16 rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                            isActive
                              ? type.color === 'orange'
                                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md transform scale-105'
                                : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md transform scale-105'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                          }`}
                          title={`${grade}학년 ${type.label}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isActive ? 'bg-white bg-opacity-30' : 'bg-gray-200'
                            }`}
                          >
                            {grade}
                          </div>
                          <span className="text-xs font-medium">
                            {isActive ? '운영' : '미운영'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-500"></div>
              <span className="text-gray-700">아침독서 운영</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600"></div>
              <span className="text-gray-700">야간 자율 운영</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span className="text-gray-700">미운영</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 예외 일정 컴포넌트
const OverrideSchedule = ({ overrides, setOverrides }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingOverride, setEditingOverride] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getOverridesForDate = (date) => {
    if (!date) return [];
    const dateStr = formatDate(date);
    return overrides.filter((o) => o.date === dateStr);
  };

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const addOverride = () => {
    const newOverride = {
      id: Date.now(),
      date: '',
      reason: '',
      grades: [],
      types: []
    };
    setEditingOverride(newOverride);
  };

  const saveOverride = (override) => {
    if (override.id && overrides.find((o) => o.id === override.id)) {
      setOverrides(overrides.map((o) => (o.id === override.id ? override : o)));
    } else {
      setOverrides([...overrides, override]);
    }
    setEditingOverride(null);
  };

  const deleteOverride = (id) => {
    if (confirm('이 예외 일정을 삭제하시겠습니까?')) {
      setOverrides(overrides.filter((o) => o.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7 text-amber-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">예외 일정 관리</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                시험, 공휴일 등 자율학습을 실시하지 않는 날을 설정합니다
              </p>
            </div>
          </div>
          <button
            onClick={addOverride}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            예외 일정 추가
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                오늘
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}

            {getDaysInMonth(currentMonth).map((date, idx) => {
              const dateOverrides = date ? getOverridesForDate(date) : [];
              const isToday = date && formatDate(date) === formatDate(new Date());

              return (
                <div
                  key={idx}
                  className={`min-h-24 border rounded-lg p-2 transition-all ${
                    date
                      ? dateOverrides.length > 0
                        ? 'bg-amber-50 border-amber-300 hover:shadow-md cursor-pointer'
                        : isToday
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {date.getDate()}
                      </div>
                      {dateOverrides.map((override) => (
                        <div
                          key={override.id}
                          className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded mb-1 font-medium truncate"
                          title={override.reason}
                        >
                          {override.reason}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{' '}
                {selectedDate.getDate()}일
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {getOverridesForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getOverridesForDate(selectedDate).map((override) => (
                  <div
                    key={override.id}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">{override.reason}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingOverride(override)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOverride(override.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">학년:</span>{' '}
                        {override.grades.map((g) => `${g}학년`).join(', ')}
                      </p>
                      <p>
                        <span className="font-medium">중단:</span> {override.types.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                이 날짜에 등록된 예외 일정이 없습니다.
              </p>
            )}
          </div>
        )}
      </div>

      {editingOverride && (
        <OverrideEditModal
          override={editingOverride}
          onSave={saveOverride}
          onClose={() => setEditingOverride(null)}
        />
      )}
    </>
  );
};

// 메인 컴포넌트
const SelfStudyScheduleManager = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      semester: '1학기',
      type: '야간 자율',
      grades: [1, 2, 3],
      applicationStart: '2025-03-01',
      applicationEnd: '2025-03-07',
      operationStart: '2025-03-10',
      operationEnd: '2025-07-18',
      additionalApplications: []
    }
  ]);

  const [weeklySchedule, setWeeklySchedule] = useState({
    월: { grade1: ['아침독서'], grade2: ['아침독서', '야간 자율'], grade3: ['야간 자율'] },
    화: { grade1: ['아침독서'], grade2: ['아침독서', '야간 자율'], grade3: ['야간 자율'] },
    수: { grade1: ['아침독서'], grade2: ['아침독서', '야간 자율'], grade3: ['야간 자율'] },
    목: { grade1: ['아침독서'], grade2: ['아침독서', '야간 자율'], grade3: ['야간 자율'] },
    금: { grade1: ['아침독서'], grade2: ['아침독서'], grade3: [] }
  });

  const [overrides, setOverrides] = useState([
    {
      id: 1,
      date: '2025-05-15',
      reason: '중간고사',
      grades: [1, 2, 3],
      types: ['아침독서', '야간 자율']
    },
    {
      id: 2,
      date: '2025-11-13',
      reason: '수능일',
      grades: [1, 2],
      types: ['아침독서', '야간 자율']
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">자율학습 일정 관리</h1>
        <p className="text-gray-600">자율학습 일정, 요일별 운영, 예외 일정을 통합 관리합니다</p>
      </div>

      <ScheduleSettings schedules={schedules} setSchedules={setSchedules} />
      <WeeklySchedule weeklySchedule={weeklySchedule} setWeeklySchedule={setWeeklySchedule} />
      <OverrideSchedule overrides={overrides} setOverrides={setOverrides} />
    </div>
  );
};

export default SelfStudyScheduleManager;
