import DateSelecter from '../../../../components/UI/DateSelecter';
import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import Dropdown from '../../../../components/UI/Dropdown';
import TimePicker from '../../../../components/UI/TimePicker';
import GradeCapaticy from '../../../../components/AcademicCalendar/GradeCapacity';
import GradeCapacity from '../../../../components/AcademicCalendar/GradeCapacity';

const PeriodEditModal = ({ schedule, onSave, onClose }) => {
  const [editingSchedule, setEditingSchedule] = useState(schedule);

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
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 pt-4 pb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">일정 추가 및 수정</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* 기본 설정 */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Dropdown
              title="학기"
              options={['1학기', '2학기']}
              placeholder={`${editingSchedule.term_id}학기`}
              onChange={(e) => setEditingSchedule({ ...editingSchedule, term_id: Number(e[0]) })}
              multiSelect={false}
            />
            <Dropdown
              title="종류"
              options={['아침 독서', '야간 자율 학습']}
              placeholder={editingSchedule.type === 'night' ? '야간 자율 학습' : '아침 독서'}
              onChange={(e) =>
                setEditingSchedule({
                  ...editingSchedule,
                  type: e === '아침독서' ? 'morning' : 'night'
                })
              }
              multiSelect={false}
            />
          </div>
          {/* 대상 학년 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-m edium text-gray-700 mb-2">대상 학년</label>
            <div className="grid grid-cols-3 gap-4 justify-center">
              {editingSchedule.grades.map((gradeItem) => (
                <label key={gradeItem.grade} className="cursor-pointer">
                  <GradeCapacity
                    title={`${gradeItem.grade}학년`}
                    value={
                      editingSchedule.grades.find((g) => g.grade === gradeItem.grade)?.capacity ??
                      ''
                    }
                    onChange={(e) => {
                      const newCapacity = Number(e);

                      setEditingSchedule((prev) => ({
                        ...prev,
                        grades: prev.grades.map((g) =>
                          g.grade === gradeItem.grade ? { ...g, capacity: newCapacity } : g
                        )
                      }));
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* 신청/운영 기간 설정 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <DateSelecter
              title={'신청 시작일'}
              value={editingSchedule.application.start}
              onChange={(e) =>
                setEditingSchedule({
                  ...editingSchedule,
                  application: {
                    ...editingSchedule.application,
                    start: e.target.value
                  }
                })
              }
            />
            <DateSelecter
              title={'신청 종료일'}
              value={editingSchedule.application.end}
              onChange={(e) =>
                setEditingSchedule({
                  ...editingSchedule,
                  application: {
                    ...editingSchedule.application,
                    end: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <DateSelecter
              title={'운영 시작일'}
              value={editingSchedule.operation.start}
              onChange={(e) =>
                setEditingSchedule({
                  ...editingSchedule,
                  operation: {
                    ...editingSchedule.operation,
                    start: e.target.value
                  }
                })
              }
            />
            <DateSelecter
              title={'운영 종료일'}
              value={editingSchedule.operation.end}
              onChange={(e) =>
                setEditingSchedule({
                  ...editingSchedule,
                  operation: {
                    ...editingSchedule.operation,
                    end: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <TimePicker
              title={'운영 시작 시간'}
              value={editingSchedule.dailyOperation.start}
              onChange={(e) =>
                setEditingSchedule({
                  ...editingSchedule,
                  dailyOperation: {
                    ...editingSchedule.dailyOperation,
                    start: e
                  }
                })
              }
            />
            <TimePicker
              title={'운영 종료 시간'}
              value={editingSchedule.dailyOperation.end}
              onChange={(e) =>
                setEditingSchedule({
                  ...editingSchedule,
                  dailyOperation: {
                    ...editingSchedule.dailyOperation,
                    end: e
                  }
                })
              }
            />
          </div>

          <>
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
              <>
                {editingSchedule.additionalApplications.map((app, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <DateSelecter
                      title={''}
                      value={app.start}
                      onChange={(e) => {
                        const newApps = [...editingSchedule.additionalApplications];
                        newApps[idx].start = e.target.value;
                        setEditingSchedule({ ...editingSchedule, additionalApplications: newApps });
                      }}
                    />
                    <DateSelecter
                      title={''}
                      value={app.end}
                      onChange={(e) => {
                        const newApps = [...editingSchedule.additionalApplications];
                        newApps[idx].end = e.target.value;
                        setEditingSchedule({ ...editingSchedule, additionalApplications: newApps });
                      }}
                    />
                    <button
                      onClick={() => removeAdditionalApplication(idx)}
                      className="mt-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                추가 신청 기간이 없습니다
              </p>
            )}
          </>
        </div>

        <div className="sticky bottom-0 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
          >
            <X className="w-4 h-4" />
            취소
          </button>
          <button
            onClick={() => onSave(editingSchedule)}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg flex items-center gap-2 font-medium shadow-sm"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodEditModal;
