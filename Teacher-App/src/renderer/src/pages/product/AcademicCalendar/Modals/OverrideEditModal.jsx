import { X, Save } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
              <input
                type="date"
                value={editingOverride.date}
                onChange={(e) => setEditingOverride({ ...editingOverride, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사유</label>
              <input
                type="text"
                value={editingOverride.description}
                onChange={(e) =>
                  setEditingOverride({ ...editingOverride, description: e.target.value })
                }
                placeholder="예: 중간고사, 수능일"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
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

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end rounded-b-xl">
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
