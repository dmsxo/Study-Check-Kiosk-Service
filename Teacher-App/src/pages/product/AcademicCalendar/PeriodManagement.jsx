import { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import PeriodEditModal from './Modals/PeriodEditModal';
import dayjs from 'dayjs';
import {
  useCreatePeriod,
  useUpdatePeriod,
  useDeletePeriod,
} from '../../../hooks/usePeriod';

function PeriodManagement({ schedules }) {
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);

  // Hooks
  const createPeriod = useCreatePeriod();
  const updatePeriod = useUpdatePeriod();
  const deletePeriod = useDeletePeriod();

  const addNewSchedule = () => {
    const newSchedule = {
      name: '',
      description: '',
      registration: { start: '', end: '' },
      additionalRegistration: [],
      operation: { start: '', end: '' },
      dailyOperation: { start: '', end: '' },
      capacities: [
        { grade: 1, capacity: 0 },
        { grade: 2, capacity: 0 },
        { grade: 3, capacity: 0 },
      ],
      schedules: [],
    };
    setEditingSchedule(newSchedule);
  };

  const saveSchedule = (schedule) => {
    // 유효성 검사
    const errors = [];

    if (!schedule.name || schedule.name.trim() === '') {
      errors.push('프로그램 이름을 입력해주세요.');
    }

    if (!schedule.registration.start || !schedule.registration.end) {
      errors.push('신청 기간을 모두 입력해주세요.');
    } else if (schedule.registration.start > schedule.registration.end) {
      errors.push('신청 종료일은 시작일보다 늦어야 합니다.');
    }

    if (!schedule.operation.start || !schedule.operation.end) {
      errors.push('운영 기간을 모두 입력해주세요.');
    } else if (schedule.operation.start > schedule.operation.end) {
      errors.push('운영 종료일은 시작일보다 늦어야 합니다.');
    }

    if (!schedule.dailyOperation.start || !schedule.dailyOperation.end) {
      errors.push('운영 시간을 모두 입력해주세요.');
    } else if (schedule.dailyOperation.start >= schedule.dailyOperation.end) {
      errors.push('운영 종료 시간은 시작 시간보다 늦어야 합니다.');
    }

    // capacities 확인
    const hasActiveGrade =
      schedule.capacities &&
      schedule.capacities.some((c) => c.capacities !== 0);
    if (!hasActiveGrade) {
      errors.push('최소 1개 학년 이상 운영해야 합니다.');
    }

    // 운영하는 학년에 대한 요일 확인
    if (schedule.capacities && schedule.schedules) {
      schedule.capacities.forEach((cap) => {
        if (cap.capacities !== 0) {
          const hasWeekdays = schedule.schedules.some(
            (s) => s.grade === cap.grade && s.isOpen,
          );
          if (!hasWeekdays) {
            errors.push(
              `${cap.grade}학년의 운영 요일을 1개 이상 선택해주세요.`,
            );
          }
        }
      });
    }

    // 추가 신청 기간 유효성 검사
    if (
      schedule.additionalRegistration &&
      schedule.additionalRegistration.length > 0
    ) {
      schedule.additionalRegistration.forEach((app, idx) => {
        if (!app.start || !app.end) {
          errors.push(
            `추가 신청 기간 ${idx + 1}차의 날짜를 모두 입력해주세요.`,
          );
        } else if (app.start > app.end) {
          errors.push(
            `추가 신청 기간 ${idx + 1}차의 종료일은 시작일보다 늦어야 합니다.`,
          );
        }
      });
    }

    if (errors.length > 0) {
      alert('다음 항목을 확인해주세요:\n\n' + errors.join('\n'));
      return;
    }

    // 저장 (hooks 사용)
    if (schedule.id) {
      updatePeriod.mutate(schedule, {
        onSuccess: () => {
          setEditingSchedule(null);
        },
        onError: (error) => {
          alert('프로그램 수정에 실패했습니다.');
          console.error(error);
        },
      });
    } else {
      createPeriod.mutate(schedule, {
        onSuccess: () => {
          setEditingSchedule(null);
        },
        onError: (error) => {
          alert('프로그램 생성에 실패했습니다.');
          console.error(error);
        },
      });
    }
  };

  const deleteSchedule = (id) => {
    const schedule = schedules.find((s) => s.id === id);
    setDeleteConfirmModal(schedule);
  };

  const confirmDelete = () => {
    if (deleteConfirmModal) {
      deletePeriod.mutate(deleteConfirmModal.id, {
        onSuccess: () => {
          setDeleteConfirmModal(null);
        },
        onError: (error) => {
          alert('프로그램 삭제에 실패했습니다.');
          console.error(error);
        },
      });
    }
  };

  return (
    <LayoutContainer className="mb-5 flex-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
          자율학습 프로그램 관리
        </h2>
        <button
          onClick={addNewSchedule}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg min-w-fit hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="">프로그램 추가</span>
        </button>
      </div>

      {/* 자율학습 운영 기간 view */}
      <div className="space-y-3 mb-3 overflow-y-auto h-72">
        {schedules.length === 0 && (
          <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-700">
            현재 운영중인 자율학습 프로그램이 없습니다.
          </div>
        )}
        {schedules.map((schedule, idx) => {
          // 요일 매핑
          const weekdayMap = {
            SUN: '일',
            MON: '월',
            TUES: '화',
            WED: '수',
            THUR: '목',
            FRI: '금',
            SAT: '토',
          };

          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-lg">
                      {schedule.name || '프로그램 이름 없음'}
                    </span>
                  </div>
                  {schedule.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {schedule.description}
                    </p>
                  )}
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

              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-600 mb-1">신청 기간</p>
                  <p className="font-medium text-gray-900">
                    {schedule.registration.start} ~ {schedule.registration.end}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">운영 기간</p>
                  <p className="font-medium text-gray-900">
                    {schedule.operation.start} ~ {schedule.operation.end}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">운영 시간</p>
                  <p className="font-medium text-gray-900">
                    {schedule.dailyOperation.start} ~{' '}
                    {schedule.dailyOperation.end}
                  </p>
                </div>
              </div>

              {/* 학년별 정보 */}
              <div className="border-t border-gray-200 pt-3 mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  학년별 수용 인원 및 운영 요일
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {schedule.capacities &&
                    schedule.capacities.map((capacitiesInfo) => {
                      // 해당 학년의 운영 요일 찾기
                      const gradeSchedules = schedule.schedules
                        ? schedule.schedules.filter(
                            (s) => s.grade === capacitiesInfo.grade && s.isOpen,
                          )
                        : [];

                      return (
                        <div
                          key={capacitiesInfo.grade}
                          className="bg-gray-50 rounded-lg p-2.5 text-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              {capacitiesInfo.grade}학년
                            </span>
                            <span className="text-xs text-gray-600">
                              {capacitiesInfo.capacity === 0
                                ? '운영 안함'
                                : capacitiesInfo.capacity === -1
                                  ? '무제한'
                                  : `${capacitiesInfo.capacity}명`}
                            </span>
                          </div>
                          {gradeSchedules.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {gradeSchedules.map((schedItem, schedIdx) => (
                                <span
                                  key={schedIdx}
                                  className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded"
                                >
                                  {weekdayMap[schedItem.weekday]}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {schedule.additionalRegistration &&
                schedule.additionalRegistration.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">추가 신청 기간</p>
                    {schedule.additionalRegistration.map((app, idx) => (
                      <p
                        key={idx}
                        className="text-sm font-medium text-gray-900"
                      >
                        {idx + 1}차 : {app.start} ~ {app.end}
                      </p>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {editingSchedule && (
        <PeriodEditModal
          schedule={editingSchedule}
          onSave={saveSchedule}
          onClose={() => setEditingSchedule(null)}
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
                    프로그램 삭제
                  </h3>
                  <p className="text-sm text-gray-600">
                    정말로 삭제하시겠습니까?
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {deleteConfirmModal.name}
                </p>
                {deleteConfirmModal.description && (
                  <p className="text-xs text-gray-600">
                    {deleteConfirmModal.description}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-6">
                이 작업은 되돌릴 수 없습니다. 관련된 모든 데이터가 삭제됩니다.
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

export default PeriodManagement;
