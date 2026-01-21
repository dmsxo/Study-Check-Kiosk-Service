import React, { useState } from 'react';

export default function GradeCapacity({ title, value, onChange }) {
  // value가 0이면 운영 안 함
  const isEnabled = value !== 0;
  // value가 -1이면 제한 없음
  const hasLimit = value > 0;
  // value가 양수면 그 값이 최대 인원
  const maxStudents = value > 0 ? value : 30;

  const handleToggle = () => {
    if (isEnabled) {
      onChange?.(0); // 운영 중지
    } else {
      onChange?.(-1); // 운영 시작 (제한 없음)
    }
  };

  const handleLimitToggle = () => {
    if (hasLimit) {
      onChange?.(-1); // 제한 해제
    } else {
      onChange?.(30); // 제한 설정 (기본 30명)
    }
  };

  const handleMaxStudentsChange = (e) => {
    const newValue = Math.max(1, parseInt(e.target.value) || 1);
    onChange?.(newValue);
  };

  return (
    <>
      <div className="w-full bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 font-medium">{title}</span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              isEnabled ? 'bg-gray-700' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {isEnabled && (
          <div className="pt-2 border-t border-gray-100 animate-slideDown mt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-600">최대</span>
                <input
                  type="number"
                  min="1"
                  value={maxStudents}
                  onChange={handleMaxStudentsChange}
                  disabled={!hasLimit}
                  className={`w-12 px-1.5 py-0.5 text-xs text-center border rounded focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors ${
                    hasLimit
                      ? 'border-gray-300 bg-white text-gray-900'
                      : 'border-gray-200 bg-gray-100 text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${hasLimit ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  명
                </span>
              </div>
              <button
                onClick={handleLimitToggle}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  hasLimit
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {hasLimit ? '제한' : '무제한'}
              </button>
            </div>
          </div>
        )}
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
    </>
  );
}
