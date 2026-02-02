import DateSelecter from '../../../../components/UI/DateSelecter';
import { useState } from 'react';
import { Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';
import TimePicker from '../../../../components/UI/TimePicker';
import GradeCapacity from '../../../../components/AcademicCalendar/GradeCapacity';

const PeriodEditModal = ({ schedule, onSave, onClose }) => {
  const [editingSchedule, setEditingSchedule] = useState(schedule);
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const weekdayNames = ['월', '화', '수', '목', '금', '토', '일'];
  const weekdayValues = ['MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'];

  const addAdditionalApplication = () => {
    setEditingSchedule({
      ...editingSchedule,
      additionalRegistration: [
        ...editingSchedule.additionalRegistration,
        { start: '', end: '' },
      ],
    });
  };

  const removeAdditionalApplication = (index) => {
    setEditingSchedule({
      ...editingSchedule,
      additionalRegistration: editingSchedule.additionalRegistration.filter(
        (_, idx) => idx !== index,
      ),
    });
  };

  // 특정 학년의 특정 요일이 선택되어 있는지 확인
  const isWeekdaySelected = (grade, weekday) => {
    if (!editingSchedule.schedules) return false;
    return editingSchedule.schedules.some(
      (s) => s.grade === grade && s.weekday === weekday && s.isOpen,
    );
  };

  // 요일 토글
  const toggleWeekday = (grade, weekday) => {
    setEditingSchedule((prev) => {
      const newSchedule = [...(prev.schedules || [])];
      const existingIndex = newSchedule.findIndex(
        (s) => s.grade === grade && s.weekday === weekday,
      );

      if (existingIndex >= 0) {
        // 이미 존재하면 isOpen 토글
        newSchedule[existingIndex] = {
          ...newSchedule[existingIndex],
          isOpen: !newSchedule[existingIndex].isOpen,
        };
      } else {
        // 존재하지 않으면 새로 추가
        newSchedule.push({
          grade: grade,
          weekday: weekday,
          isOpen: true,
        });
      }

      console.log('sex', { ...prev, schedules: newSchedule });
      return { ...prev, schedules: newSchedule };
    });
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 프로그램 이름
    if (!editingSchedule.name || editingSchedule.name.trim() === '') {
      newErrors.name = '프로그램 이름을 입력해주세요.';
    }

    // 신청 기간
    if (!editingSchedule.registration.start) {
      newErrors.registrationStart = '신청 시작일을 선택해주세요.';
    }
    if (!editingSchedule.registration.end) {
      newErrors.registrationEnd = '신청 종료일을 선택해주세요.';
    }
    if (
      editingSchedule.registration.start &&
      editingSchedule.registration.end &&
      editingSchedule.registration.start > editingSchedule.registration.end
    ) {
      newErrors.registrationPeriod = '신청 종료일은 시작일보다 늦어야 합니다.';
    }

    // 운영 기간
    if (!editingSchedule.operation.start) {
      newErrors.operationStart = '운영 시작일을 선택해주세요.';
    }
    if (!editingSchedule.operation.end) {
      newErrors.operationEnd = '운영 종료일을 선택해주세요.';
    }
    if (
      editingSchedule.operation.start &&
      editingSchedule.operation.end &&
      editingSchedule.operation.start > editingSchedule.operation.end
    ) {
      newErrors.operationPeriod = '운영 종료일은 시작일보다 늦어야 합니다.';
    }

    // 운영 시간
    if (!editingSchedule.dailyOperation.start) {
      newErrors.dailyOperationStart = '운영 시작 시간을 선택해주세요.';
    }
    if (!editingSchedule.dailyOperation.end) {
      newErrors.dailyOperationEnd = '운영 종료 시간을 선택해주세요.';
    }
    if (
      editingSchedule.dailyOperation.start &&
      editingSchedule.dailyOperation.end &&
      editingSchedule.dailyOperation.start >= editingSchedule.dailyOperation.end
    ) {
      newErrors.dailyOperationPeriod =
        '운영 종료 시간은 시작 시간보다 늦어야 합니다.';
    }

    // 학년별 수용 인원
    const hasActiveGrade =
      editingSchedule.capacities &&
      editingSchedule.capacities.some((c) => c.capacity !== 0);
    if (!hasActiveGrade) {
      newErrors.capacity = '최소 1개 학년 이상 운영해야 합니다.';
    }

    // 운영하는 학년의 요일 확인
    if (editingSchedule.capacities && editingSchedule.schedules) {
      editingSchedule.capacities.forEach((cap) => {
        if (cap.capacity !== 0) {
          const hasWeekdays = editingSchedule.schedules.some(
            (s) => s.grade === cap.grade && s.isOpen,
          );
          if (!hasWeekdays) {
            newErrors[`weekday_${cap.grade}`] =
              `${cap.grade}학년의 운영 요일을 1개 이상 선택해주세요.`;
          }
        }
      });
    }

    // 추가 신청 기간
    if (
      editingSchedule.additionalRegistration &&
      editingSchedule.additionalRegistration.length > 0
    ) {
      editingSchedule.additionalRegistration.forEach((app, idx) => {
        if (!app.start || !app.end) {
          newErrors[`additionalReg_${idx}`] = '날짜를 모두 입력해주세요.';
        } else if (app.start > app.end) {
          newErrors[`additionalReg_${idx}`] =
            '종료일은 시작일보다 늦어야 합니다.';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    setShowValidation(true);
    if (validateForm()) {
      onSave(editingSchedule);
    }
  };

  const handleClose = () => {
    if (showValidation && Object.keys(errors).length > 0) {
      if (confirm('입력한 내용이 저장되지 않습니다. 정말 닫으시겠습니까?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  console.log(editingSchedule);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 pt-4 pb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            프로그램 {schedule.id ? '수정' : '추가'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 기본 정보 */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
              기본 정보
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로그램 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingSchedule.name || ''}
                  onChange={(e) =>
                    setEditingSchedule({
                      ...editingSchedule,
                      name: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-gray-500 text-gray-700 ${
                    showValidation && errors.name
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="예: 야간 자율학습, 아침 독서"
                />
                {showValidation && errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로그램 소개
                </label>
                <textarea
                  value={editingSchedule.description || ''}
                  onChange={(e) =>
                    setEditingSchedule({
                      ...editingSchedule,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 text-gray-700 resize-none"
                  rows="3"
                  placeholder="프로그램에 대한 간단한 설명을 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 학년별 설정 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
              학년별 수용 인원 및 운영 요일
            </h4>

            {showValidation && errors.capacity && (
              <p className="mb-3 text-sm text-red-600 flex items-center gap-1 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.capacity}
              </p>
            )}

            <div className="space-y-4">
              {editingSchedule.capacities &&
                editingSchedule.capacities.map((capacityItem) => (
                  <div
                    key={capacityItem.grade}
                    className={`border rounded-lg p-4 ${
                      showValidation && errors[`weekday_${capacityItem.grade}`]
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="mb-3">
                      <GradeCapacity
                        title={`${capacityItem.grade}학년`}
                        value={capacityItem.capacity ?? 0}
                        onChange={(newCapacity) => {
                          setEditingSchedule((prev) => ({
                            ...prev,
                            capacities: prev.capacities.map((c) =>
                              c.grade === capacityItem.grade
                                ? { ...c, capacity: newCapacity }
                                : c,
                            ),
                          }));
                        }}
                      />
                    </div>

                    {/* 운영 안함이 아닐 때만 운영 요일 선택 표시 */}
                    {capacityItem.capacity !== 0 && (
                      <div className="animate-slideDown">
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          운영 요일 선택
                        </label>
                        <div className="flex gap-2">
                          {weekdayValues.map((weekday, idx) => {
                            const isSelected = isWeekdaySelected(
                              capacityItem.grade,
                              weekday,
                            );
                            return (
                              <button
                                key={weekday}
                                type="button"
                                onClick={() =>
                                  toggleWeekday(capacityItem.grade, weekday)
                                }
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  isSelected
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {weekdayNames[idx]}
                              </button>
                            );
                          })}
                        </div>
                        {showValidation &&
                          errors[`weekday_${capacityItem.grade}`] && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors[`weekday_${capacityItem.grade}`]}
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* 신청/운영 기간 설정 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
              신청 및 운영 기간
            </h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <DateSelecter
                    title={'신청 시작일'}
                    value={editingSchedule.registration.start}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        registration: {
                          ...editingSchedule.registration,
                          start: e.target.value,
                        },
                      })
                    }
                  />
                  {showValidation && errors.registrationStart && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.registrationStart}
                    </p>
                  )}
                </div>
                <div>
                  <DateSelecter
                    title={'신청 종료일'}
                    value={editingSchedule.registration.end}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        registration: {
                          ...editingSchedule.registration,
                          end: e.target.value,
                        },
                      })
                    }
                  />
                  {showValidation && errors.registrationEnd && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.registrationEnd}
                    </p>
                  )}
                </div>
              </div>
              {showValidation && errors.registrationPeriod && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.registrationPeriod}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <DateSelecter
                    title={'운영 시작일'}
                    value={editingSchedule.operation.start}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        operation: {
                          ...editingSchedule.operation,
                          start: e.target.value,
                        },
                      })
                    }
                  />
                  {showValidation && errors.operationStart && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.operationStart}
                    </p>
                  )}
                </div>
                <div>
                  <DateSelecter
                    title={'운영 종료일'}
                    value={editingSchedule.operation.end}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        operation: {
                          ...editingSchedule.operation,
                          end: e.target.value,
                        },
                      })
                    }
                  />
                  {showValidation && errors.operationEnd && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.operationEnd}
                    </p>
                  )}
                </div>
              </div>
              {showValidation && errors.operationPeriod && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.operationPeriod}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <TimePicker
                    title={'운영 시작 시간'}
                    value={editingSchedule.dailyOperation.start}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        dailyOperation: {
                          ...editingSchedule.dailyOperation,
                          start: e,
                        },
                      })
                    }
                  />
                  {showValidation && errors.dailyOperationStart && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.dailyOperationStart}
                    </p>
                  )}
                </div>
                <div>
                  <TimePicker
                    title={'운영 종료 시간'}
                    value={editingSchedule.dailyOperation.end}
                    onChange={(e) =>
                      setEditingSchedule({
                        ...editingSchedule,
                        dailyOperation: {
                          ...editingSchedule.dailyOperation,
                          end: e,
                        },
                      })
                    }
                  />
                  {showValidation && errors.dailyOperationEnd && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.dailyOperationEnd}
                    </p>
                  )}
                </div>
              </div>
              {showValidation && errors.dailyOperationPeriod && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.dailyOperationPeriod}
                </p>
              )}
            </div>
          </div>

          {/* 추가 신청 기간 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <h4 className="text-sm font-semibold text-gray-700">
                추가 신청 기간
              </h4>
              <button
                onClick={addAdditionalApplication}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>

            {editingSchedule.additionalRegistration &&
            editingSchedule.additionalRegistration.length > 0 ? (
              <div className="space-y-3">
                {editingSchedule.additionalRegistration.map((app, idx) => (
                  <div key={idx}>
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                      <DateSelecter
                        title={idx === 0 ? '시작일' : ''}
                        value={app.start}
                        onChange={(e) => {
                          const newApps = [
                            ...editingSchedule.additionalRegistration,
                          ];
                          newApps[idx].start = e.target.value;
                          setEditingSchedule({
                            ...editingSchedule,
                            additionalRegistration: newApps,
                          });
                        }}
                      />
                      <DateSelecter
                        title={idx === 0 ? '종료일' : ''}
                        value={app.end}
                        onChange={(e) => {
                          const newApps = [
                            ...editingSchedule.additionalRegistration,
                          ];
                          newApps[idx].end = e.target.value;
                          setEditingSchedule({
                            ...editingSchedule,
                            additionalRegistration: newApps,
                          });
                        }}
                      />
                      <button
                        onClick={() => removeAdditionalApplication(idx)}
                        className="px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {showValidation && errors[`additionalReg_${idx}`] && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors[`additionalReg_${idx}`]}
                      </p>
                    )}
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
          >
            <X className="w-4 h-4" />
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 font-medium shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PeriodEditModal;
