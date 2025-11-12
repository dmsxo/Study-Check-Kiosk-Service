import { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import LayoutContainer from '../../../components/UI/LayoutContainer';

function PeriodManagement() {
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

  const grades = [1, 2, 3];
  const types = ['아침독서', '야간 자율'];

  const [isEditing, setIsEditing] = useState(false);
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

  return (
    <LayoutContainer>
      {/* Title */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">자율학습 일정 목록</h2>
        <button
          onClick={addNewSchedule}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />새 일정 추가
        </button>
      </div>

      {/* Schedule Create or Edit */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          일정 {editingSchedule.id ? '수정' : '생성'}
        </h3>
      </div>

      {/* Study Schedules */}
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
    </LayoutContainer>
  );
}

export default PeriodManagement;
