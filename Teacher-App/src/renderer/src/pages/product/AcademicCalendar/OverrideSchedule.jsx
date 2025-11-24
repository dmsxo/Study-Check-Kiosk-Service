import CalendarUI from '../../../components/Calendar';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import OverrideEditModal from './Modals/OverrideEditModal';
import {
  CreateOverrideSchedule,
  DeleteOverrideScedule,
  UpdateOverrideSchedule
} from '../../../api/AcademicCalendarAPI';

function OverrideSchedule({ overrides, setOverrides }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingOverride, setEditingOverride] = useState(null);

  const selectedDateOverrides = overrides.filter((o) => o.date === selectedDate);

  const addOverride = () => {
    const newOverride = {
      id: overrides.length + 1,
      date: '',
      descriptions: [],
      targets: {
        morning: { grade1: true, grade2: true, grade3: true },
        night: { grade1: true, grade2: true, grade3: true }
      }
    };
    setEditingOverride(newOverride);
  };

  const saveOverride = (override) => {
    console.log(override);
    if (overrides.find((o) => o.id === override.id)) {
      setOverrides(overrides.map((o) => (o.id === override.id ? override : o)));
      UpdateOverrideSchedule(override);
    } else {
      setOverrides([...overrides, override]);
      CreateOverrideSchedule(override);
    }
    setEditingOverride(null);
  };

  const deleteOverride = (id) => {
    if (confirm('이 예외 일정을 삭제하시겠습니까?')) {
      const scedule = overrides.find((o) => o.id === id);
      DeleteOverrideScedule(scedule.date);
      setOverrides(overrides.filter((o) => o.id !== id));
    }
  };

  const dayContent = (date) => {
    const currentOverrides = overrides.filter((o) => o.date === date);
    const curruntDay = dayjs().format('YYYY-MM-DD');
    return (
      <div
        key={date}
        className={`min-h-24 rounded-xl border p-2 ${
          currentOverrides.length > 0
            ? 'bg-amber-50 border-amber-300'
            : curruntDay === date
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white border-gray-200'
        }`}
        onClick={() => setSelectedDate(date)}
      >
        <p
          className={`text-sm font-medium mb-1 ${
            curruntDay === date ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          {Number(date.split('-')[2])}
        </p>
        {currentOverrides[0]?.descriptions?.map((reason, idx) => (
          <div
            key={idx}
            className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded mb-1 font-medium truncate"
            title={reason}
          >
            {reason}
          </div>
        ))}
      </div>
    );
  };

  return (
    <LayoutContainer className="space-y-6 mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-2xl">예외 일정 관리</h2>
        <button
          onClick={addOverride}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg "
        >
          <Plus className="w-4 h-4" />새 일정 추가
        </button>
      </div>

      {/* Calendar */}
      <LayoutContainer className="mx-5">
        <CalendarUI dayContent={dayContent} />
      </LayoutContainer>

      {/* Detail View */}
      {selectedDate && (
        <LayoutContainer className="mx-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate.split('-')[0]}년 {selectedDate.split('-')[1]}월{' '}
              {selectedDate.split('-')[2]}일
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {selectedDateOverrides.length > 0 ? (
            <div className="space-y-3">
              {selectedDateOverrides.map((override) => (
                <div
                  key={override.id}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">
                      {override.descriptions.join(' / ')}
                    </span>
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
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    {/* 아침 독서 중단 학년 */}
                    <p>
                      <span className="font-medium">아침 독서 운영 학년:</span>{' '}
                      {Object.entries(override.targets.morning)
                        .filter(([_, selected]) => selected) // false인 학년 → 중단
                        .map(([gradeKey]) => `${gradeKey.replace('grade', '')}학년`)
                        .join(', ') || '없음'}
                    </p>

                    {/* 야간 자율 학습 중단 학년 */}
                    <p>
                      <span className="font-medium">야간 자율 학습 운영 학년:</span>{' '}
                      {Object.entries(override.targets.night)
                        .filter(([_, selected]) => selected)
                        .map(([gradeKey]) => `${gradeKey.replace('grade', '')}학년`)
                        .join(', ') || '없음'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">이 날짜에 등록된 예외 일정이 없습니다.</p>
          )}
        </LayoutContainer>
      )}

      {editingOverride && (
        <OverrideEditModal
          override={editingOverride}
          onSave={saveOverride}
          onClose={() => setEditingOverride(null)}
        />
      )}
    </LayoutContainer>
  );
}

export default OverrideSchedule;
