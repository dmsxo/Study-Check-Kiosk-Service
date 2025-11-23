import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const OverrideEditModal = ({ override, onSave, onClose }) => {
  const [editingOverride, setEditingOverride] = useState(override);
  const grades = [1, 2, 3];
  const types = ['morning', 'night'];
  const typeLabels = { morning: '아침 독서', night: '야간 자율 학습' };

  const toggleGradeForType = (type, grade) => {
    const gradeKey = `grade${grade}`;
    setEditingOverride((prev) => ({
      ...prev,
      targets: {
        ...prev.targets,
        [type]: {
          ...prev.targets[type],
          [gradeKey]: !prev.targets[type][gradeKey]
        }
      }
    }));
  };

  const isGradeSelected = (type, grade) => {
    const gradeKey = `grade${grade}`;
    return editingOverride.targets[type][gradeKey];
  };

  const addDescription = () => {
    const descriptions = editingOverride.descriptions || [];
    setEditingOverride({
      ...editingOverride,
      descriptions: [...descriptions, '']
    });
  };

  const updateDescription = (index, value) => {
    const descriptions = [...editingOverride.descriptions];
    descriptions[index] = value;
    setEditingOverride({
      ...editingOverride,
      descriptions: descriptions
    });
  };

  const removeDescription = (index) => {
    const descriptions = editingOverride.descriptions.filter((_, i) => i !== index);
    setEditingOverride({
      ...editingOverride,
      descriptions: descriptions
    });
  };

  const descriptions = Array.isArray(editingOverride.descriptions)
    ? editingOverride.descriptions
    : editingOverride.descriptions
      ? [editingOverride.descriptions]
      : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl sticky top-0">
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
            <input
              type="date"
              value={editingOverride.date}
              onChange={(e) => setEditingOverride({ ...editingOverride, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">사유</label>
              <button
                onClick={addDescription}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>

            <div className="space-y-2">
              {descriptions.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-lg">
                  사유를 추가해주세요
                </div>
              ) : (
                descriptions.map((desc, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => updateDescription(index, e.target.value)}
                      placeholder="예: 중간고사, 수능일"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeDescription(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              운영할 자율학습 및 학년
            </label>

            <div className="space-y-3">
              {types.map((type) => (
                <div key={type} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium text-gray-900">{typeLabels[type]}</span>
                  </div>

                  <div className="flex gap-4">
                    {grades.map((grade) => (
                      <label key={grade} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isGradeSelected(type, grade)}
                          onChange={() => toggleGradeForType(type, grade)}
                          className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">{grade}학년</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end rounded-b-xl sticky bottom-0">
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

export default OverrideEditModal;
