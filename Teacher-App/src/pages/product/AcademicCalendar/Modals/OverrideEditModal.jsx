import { X, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const OverrideEditModal = ({ override, periods, onSave, onClose }) => {
  const [editingOverride, setEditingOverride] = useState(override);
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const grades = [1, 2, 3];

  // 특정 period의 특정 학년이 선택되어 있는지 확인
  const isGradeSelected = (periodId, grade) => {
    if (!editingOverride.mappings) return false;
    const mapping = editingOverride.mappings.find(
      (m) => m.periodId === periodId && m.grade === grade,
    );
    return mapping ? mapping.isOpen : false;
  };

  // 특정 period의 특정 학년 토글
  const toggleGradeForPeriod = (periodId, grade) => {
    setEditingOverride((prev) => {
      const mappings = [...(prev.mappings || [])];
      const existingIndex = mappings.findIndex(
        (m) => m.periodId === periodId && m.grade === grade,
      );

      if (existingIndex >= 0) {
        // 이미 존재하면 isOpen 토글
        mappings[existingIndex] = {
          ...mappings[existingIndex],
          isOpen: !mappings[existingIndex].isOpen,
        };
      } else {
        // 존재하지 않으면 새로 추가
        mappings.push({
          periodId: periodId,
          grade: grade,
          isOpen: true,
        });
      }

      return { ...prev, mappings };
    });
  };

  const addDescription = () => {
    const descriptions = editingOverride.descriptions || [];
    setEditingOverride({
      ...editingOverride,
      descriptions: [...descriptions, ''],
    });
  };

  const updateDescription = (index, value) => {
    const descriptions = [...editingOverride.descriptions];
    descriptions[index] = value;
    setEditingOverride({
      ...editingOverride,
      descriptions: descriptions,
    });
  };

  const removeDescription = (index) => {
    const descriptions = editingOverride.descriptions.filter(
      (_, i) => i !== index,
    );
    setEditingOverride({
      ...editingOverride,
      descriptions: descriptions,
    });
  };

  const descriptions = Array.isArray(editingOverride.descriptions)
    ? editingOverride.descriptions
    : editingOverride.descriptions
      ? [editingOverride.descriptions]
      : [];

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 날짜
    if (!editingOverride.date || editingOverride.date.trim() === '') {
      newErrors.date = '날짜를 선택해주세요.';
    }

    // 사유
    if (
      !editingOverride.descriptions ||
      editingOverride.descriptions.length === 0
    ) {
      newErrors.descriptions = '최소 1개 이상의 사유를 입력해주세요.';
    } else {
      editingOverride.descriptions.forEach((desc, idx) => {
        if (!desc || desc.trim() === '') {
          newErrors[`description_${idx}`] = '사유를 입력하거나 삭제해주세요.';
        }
      });
    }

    // mappings - 최소 1개 이상의 학년 선택
    const hasActiveMapping =
      editingOverride.mappings &&
      editingOverride.mappings.some((m) => m.isOpen);
    if (!hasActiveMapping) {
      newErrors.mappings = '최소 1개 프로그램의 1개 학년 이상을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    setShowValidation(true);
    if (validateForm()) {
      console.log('Saving override:', editingOverride);
      onSave(editingOverride);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl sticky top-0 z-10">
          <h3 className="text-xl font-bold text-gray-900">
            예외 일정 {override.id ? '수정' : '추가'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* 날짜 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날짜 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={editingOverride.date}
              onChange={(e) =>
                setEditingOverride({ ...editingOverride, date: e.target.value })
              }
              className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                showValidation && errors.date
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {showValidation && errors.date && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.date}
              </p>
            )}
          </div>

          {/* 사유 입력 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                사유 <span className="text-red-500">*</span>
              </label>
              <button
                onClick={addDescription}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>

            {showValidation && errors.descriptions && (
              <p className="mb-3 text-sm text-red-600 flex items-center gap-1 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.descriptions}
              </p>
            )}

            <div className="space-y-2">
              {descriptions.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-lg">
                  사유를 추가해주세요
                </div>
              ) : (
                descriptions.map((desc, index) => (
                  <div key={index}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) =>
                          updateDescription(index, e.target.value)
                        }
                        placeholder="예: 중간고사, 수능일, 공식 휴강일"
                        className={`flex-1 px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                          showValidation && errors[`description_${index}`]
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                      <button
                        onClick={() => removeDescription(index)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {showValidation && errors[`description_${index}`] && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors[`description_${index}`]}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 프로그램별 학년 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              운영할 프로그램 및 학년 선택
            </label>

            {showValidation && errors.mappings && (
              <p className="mb-3 text-sm text-red-600 flex items-center gap-1 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {errors.mappings}
              </p>
            )}

            {periods && periods.length > 0 ? (
              <div className="space-y-3">
                {periods.map((period) => (
                  <div
                    key={period.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium text-gray-900">
                        {period.name}
                      </span>
                      {period.description && (
                        <span className="text-xs text-gray-500">
                          ({period.description})
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {grades.map((grade) => {
                        // 해당 학년이 이 프로그램을 운영하는지 확인
                        const capacityInfo = period.capacities
                          ? period.capacities.find((c) => c.grade === grade)
                          : null;
                        const isAvailable =
                          capacityInfo && capacityInfo.capacity !== 0;

                        return (
                          <label
                            key={grade}
                            className={`flex items-center gap-2 ${
                              isAvailable
                                ? 'cursor-pointer'
                                : 'cursor-not-allowed opacity-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isGradeSelected(period.id, grade)}
                              onChange={() =>
                                toggleGradeForPeriod(period.id, grade)
                              }
                              disabled={!isAvailable}
                              className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-gray-700">
                              {grade}학년
                              {!isAvailable && (
                                <span className="text-xs text-gray-400 ml-1">
                                  (운영 안함)
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-8 border border-dashed border-gray-300 rounded-lg">
                등록된 프로그램이 없습니다.
                <br />
                <span className="text-xs">
                  먼저 자율학습 프로그램을 등록해주세요.
                </span>
              </div>
            )}
          </div>

          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>안내:</strong> 체크된 학년만 해당 프로그램을 운영합니다.
              체크하지 않은 학년은 해당 날짜에 프로그램이 운영되지 않습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end rounded-b-xl sticky bottom-0">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
          >
            <X className="w-4 h-4" />
            취소
          </button>
          <button
            onClick={handleSave}
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

export default OverrideEditModal;
