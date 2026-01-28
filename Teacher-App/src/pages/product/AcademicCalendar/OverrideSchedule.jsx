import CalendarUI from '../../../components/Calendar';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Plus, X, Edit2, Trash2, AlertCircle } from 'lucide-react';
import OverrideEditModal from './Modals/OverrideEditModal';
import {
  useUpsertOverride,
  useDeleteOverride,
} from '../../../hooks/useOverride';

function OverrideSchedule({ overrides, periods }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingOverride, setEditingOverride] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);

  // Hooks
  const upsertOverride = useUpsertOverride();
  const deleteOverrideMutation = useDeleteOverride();

  const selectedDateOverrides = overrides.filter(
    (o) => o.date === selectedDate,
  );

  const addOverride = () => {
    const newOverride = {
      id: null,
      date: '',
      descriptions: [],
      mappings: [],
    };
    setEditingOverride(newOverride);
  };

  const saveOverride = (override) => {
    // 유효성 검사
    const errors = [];

    if (!override.date || override.date.trim() === '') {
      errors.push('날짜를 선택해주세요.');
    }

    if (!override.descriptions || override.descriptions.length === 0) {
      errors.push('최소 1개 이상의 사유를 입력해주세요.');
    } else {
      const emptyDescriptions = override.descriptions.filter(
        (d) => !d || d.trim() === '',
      );
      if (emptyDescriptions.length > 0) {
        errors.push('빈 사유가 있습니다. 모든 사유를 입력하거나 삭제해주세요.');
      }
    }

    // mappings 확인 - 최소 1개 이상의 학년이 선택되어야 함
    const hasActiveMapping =
      override.mappings && override.mappings.some((m) => m.isOpen);
    if (!hasActiveMapping) {
      errors.push('최소 1개 프로그램의 1개 학년 이상을 선택해주세요.');
    }

    if (errors.length > 0) {
      alert('다음 항목을 확인해주세요:\n\n' + errors.join('\n'));
      return;
    }

    // 저장 (hooks 사용)
    upsertOverride.mutate(override, {
      onSuccess: () => {
        setEditingOverride(null);
      },
      onError: (error) => {
        alert('예외 일정 저장에 실패했습니다.');
        console.error(error);
      },
    });
  };

  const deleteOverride = (id) => {
    const override = overrides.find((o) => o.id === id);
    setDeleteConfirmModal(override);
  };

  const confirmDelete = () => {
    if (deleteConfirmModal) {
      deleteOverrideMutation.mutate(deleteConfirmModal.id, {
        onSuccess: () => {
          setDeleteConfirmModal(null);
        },
        onError: (error) => {
          alert('예외 일정 삭제에 실패했습니다.');
          console.error(error);
        },
      });
    }
  };

  const dayContent = (date) => {
    const currentOverrides = overrides.filter((o) => o.date === date);
    const curruntDay = dayjs().format('YYYY-MM-DD');
    return (
      <div
        key={date}
        className={`min-h-24 rounded-xl border p-2 cursor-pointer transition-colors ${
          currentOverrides.length > 0
            ? 'bg-amber-50 border-amber-300 hover:bg-amber-100'
            : curruntDay === date
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white border-gray-200 hover:bg-gray-50'
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
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-2">
                        {override.descriptions &&
                        override.descriptions.length > 0
                          ? override.descriptions.join(' / ')
                          : '사유 없음'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingOverride(override)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOverride(override.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 프로그램별 운영 현황 */}
                  <div className="space-y-2">
                    {periods.map((period) => {
                      // 해당 period의 mapping 찾기
                      const periodMappings = override.mappings
                        ? override.mappings.filter(
                            (m) => m.periodId === period.id && m.isOpen,
                          )
                        : [];

                      if (periodMappings.length === 0) return null;

                      return (
                        <div key={period.id} className="text-sm">
                          <span className="font-medium text-gray-700">
                            {period.name}:
                          </span>{' '}
                          <span className="text-gray-600">
                            {periodMappings
                              .map((m) => `${m.grade}학년`)
                              .join(', ')}
                          </span>
                        </div>
                      );
                    })}

                    {/* 운영하는 프로그램이 없을 경우 */}
                    {override.mappings &&
                      override.mappings.every((m) => !m.isOpen) && (
                        <p className="text-sm text-gray-500">
                          모든 프로그램 운영 중단
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              이 날짜에 등록된 예외 일정이 없습니다.
            </p>
          )}
        </LayoutContainer>
      )}

      {editingOverride && (
        <OverrideEditModal
          override={editingOverride}
          periods={periods}
          onSave={saveOverride}
          onClose={() => setEditingOverride(null)}
        />
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    예외 일정 삭제
                  </h3>
                  <p className="text-sm text-gray-600">
                    정말로 삭제하시겠습니까?
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {deleteConfirmModal.date}
                </p>
                {deleteConfirmModal.descriptions &&
                  deleteConfirmModal.descriptions.length > 0 && (
                    <p className="text-xs text-gray-600">
                      {deleteConfirmModal.descriptions.join(' / ')}
                    </p>
                  )}
              </div>

              <p className="text-sm text-gray-600 mb-6">
                이 작업은 되돌릴 수 없습니다.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmModal(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  취소
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutContainer>
  );
}

export default OverrideSchedule;
