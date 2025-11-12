import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const SelfStudyScheduleManager = () => {
  const [activeTab, setActiveTab] = useState('schedule');
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
      date: '2025-11-14',
      reason: '수능일',
      grades: [1, 2],
      types: ['아침독서', '야간 자율']
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingOverride, setEditingOverride] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const days = ['월', '화', '수', '목', '금'];
  const grades = [1, 2, 3];
  const types = ['아침독서', '야간 자율'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];
    // Add empty cells for days before the first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days in the month
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
    setIsEditing(true);
  };

  const saveSchedule = () => {
    if (editingSchedule.id && schedules.find((s) => s.id === editingSchedule.id)) {
      setSchedules(schedules.map((s) => (s.id === editingSchedule.id ? editingSchedule : s)));
    } else {
      setSchedules([...schedules, editingSchedule]);
    }
    setIsEditing(false);
    setEditingSchedule(null);
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
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

  const saveOverride = () => {
    if (editingOverride.id && overrides.find((o) => o.id === editingOverride.id)) {
      setOverrides(overrides.map((o) => (o.id === editingOverride.id ? editingOverride : o)));
    } else {
      setOverrides([...overrides, editingOverride]);
    }
    setEditingOverride(null);
  };

  const deleteOverride = (id) => {
    setOverrides(overrides.filter((o) => o.id !== id));
  };

  const addAdditionalApplication = () => {
    setEditingSchedule({
      ...editingSchedule,
      additionalApplications: [...editingSchedule.additionalApplications, { start: '', end: '' }]
    });
  };

  return (
    <div clOverride scheduleassName="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">자율학습 일정 관리</h1>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            일정 설정
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            요일별 운영
          </button>
          <button
            onClick={() => setActiveTab('override')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'override'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            예외 일정
          </button>
        </div>

        {activeTab === 'schedule' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">자율학습 일정 목록</h2>
              <button
                onClick={addNewSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />새 일정 추가
              </button>
            </div>

            {isEditing && editingSchedule && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  일정 {editingSchedule.id ? '수정' : '생성'}
                </h3>

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
                      onChange={(e) =>
                        setEditingSchedule({ ...editingSchedule, type: e.target.value })
                      }
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
                      <label key={grade} className="flex items-center gap-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      신청 시작일
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      신청 종료일
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      운영 시작일
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      운영 종료일
                    </label>
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

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      추가 신청 기간
                    </label>
                    <button
                      onClick={addAdditionalApplication}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      추가
                    </button>
                  </div>
                  {editingSchedule.additionalApplications.map((app, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-4 mb-2">
                      <input
                        type="date"
                        value={app.start}
                        onChange={(e) => {
                          const newApps = [...editingSchedule.additionalApplications];
                          newApps[idx].start = e.target.value;
                          setEditingSchedule({
                            ...editingSchedule,
                            additionalApplications: newApps
                          });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        value={app.end}
                        onChange={(e) => {
                          const newApps = [...editingSchedule.additionalApplications];
                          newApps[idx].end = e.target.value;
                          setEditingSchedule({
                            ...editingSchedule,
                            additionalApplications: newApps
                          });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingSchedule(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                  <button
                    onClick={saveSchedule}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                </div>
              </div>
            )}

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
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setIsEditing(true);
                        }}
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
          </div>
        )}

        {activeTab === 'weekly' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">요일별 기본 운영 설정</h2>
            <p className="text-sm text-gray-600 mb-6">
              각 요일별로 학년과 자율학습 종류를 설정할 수 있습니다.
            </p>

            <div className="space-y-4">
              {days.map((day) => (
                <div
                  key={day}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{day}요일</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {grades.map((grade) => (
                      <div key={grade} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {grade}
                          </div>
                          <span className="font-semibold text-gray-900">{grade}학년</span>
                        </div>
                        <div className="space-y-2">
                          {types.map((type) => {
                            const isChecked = weeklySchedule[day][`grade${grade}`]?.includes(type);
                            return (
                              <button
                                key={type}
                                onClick={() => toggleWeeklySchedule(day, grade, type)}
                                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  isChecked
                                    ? type === '아침독서'
                                      ? 'bg-orange-500 text-white shadow-sm'
                                      : 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'override' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">예외 일정 관리</h2>
                <p className="text-sm text-gray-600 mt-1">
                  시험, 공휴일 등 자율학습을 실시하지 않는 날을 설정합니다.
                </p>
              </div>
              <button
                onClick={addOverride}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                예외 일정 추가
              </button>
            </div>

            {editingOverride && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  예외 일정 {editingOverride.date ? '수정' : '추가'}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                    <input
                      type="date"
                      value={editingOverride.date}
                      onChange={(e) =>
                        setEditingOverride({ ...editingOverride, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
                    <input
                      type="text"
                      value={editingOverride.reason}
                      onChange={(e) =>
                        setEditingOverride({ ...editingOverride, reason: e.target.value })
                      }
                      placeholder="예: 중간고사, 수능일"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">해당 학년</label>
                  <div className="flex gap-3">
                    {grades.map((grade) => (
                      <label key={grade} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingOverride.grades.includes(grade)}
                          onChange={(e) => {
                            const newGrades = e.target.checked
                              ? [...editingOverride.grades, grade]
                              : editingOverride.grades.filter((g) => g !== grade);
                            setEditingOverride({ ...editingOverride, grades: newGrades });
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{grade}학년</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    중단할 자율학습 종류
                  </label>
                  <div className="flex gap-3">
                    {types.map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingOverride.types.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...editingOverride.types, type]
                              : editingOverride.types.filter((t) => t !== type);
                            setEditingOverride({ ...editingOverride, types: newTypes });
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingOverride(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                  <button
                    onClick={saveOverride}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {/* Calendar Header */}
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

              {/* Calendar Grid */}
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

            {/* Selected Date Details */}
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
        )}
      </div>
    </div>
  );
};

export default SelfStudyScheduleManager;
