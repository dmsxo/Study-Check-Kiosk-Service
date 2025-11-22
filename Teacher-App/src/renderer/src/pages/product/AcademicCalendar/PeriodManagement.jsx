import { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import PeriodEditModal from './Modals/PeriodEditModal';
import dayjs from 'dayjs';

function PeriodManagement({ schedules, setSchedules }) {
  const [editingSchedule, setEditingSchedule] = useState(null);

  const addNewSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      semester: '',
      type: '야간 자율 학습',
      grades: [],
      applicationStart: '',
      applicationEnd: '',
      operationStart: '',
      operationEnd: '',
      dailyOperationStart: '',
      dailyOperationEnd: '',
      additionalApplications: []
    };
    setEditingSchedule(newSchedule);
  };

  const saveSchedule = (schedule) => {
    console.log(schedule);
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
    <LayoutContainer className="mb-5 flex-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
          자율학습 기간 설정
        </h2>
        <button
          onClick={addNewSchedule}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg min-w-fit"
        >
          <Plus className="w-4 h-4" />
          <span className="">새 일정 추가</span>
        </button>
      </div>

      {/* 자율학습 운영 기간 view */}
      <div className="space-y-3 mb-3 overflow-y-auto h-72">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
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
                    {idx + 1}차 : {app.start} ~ {app.end}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {editingSchedule && (
        <PeriodEditModal
          schedule={editingSchedule}
          onSave={saveSchedule}
          onClose={() => setEditingSchedule(null)}
        />
      )}
    </LayoutContainer>
  );
}

export default PeriodManagement;
