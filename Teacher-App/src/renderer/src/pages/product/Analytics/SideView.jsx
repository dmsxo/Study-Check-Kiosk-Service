function SideView({ contentWidth, selectedStudent, setSelectedStudent }) {
  return (
    <div
      style={{ width: `${100 - contentWidth}%` }}
      className="bg-white flex flex-col border-l border-gray-200 overflow-auto rounded-r-2xl"
    >
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
            <p className="text-sm text-gray-500 mt-1">학번: {selectedStudent.student_id}</p>
          </div>
          <button
            onClick={() => setSelectedStudent(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-600 mb-1 font-medium">총 출석일</p>
            <p className="text-2xl font-bold text-blue-700">{10}일</p>
            <p className="text-xs text-blue-600 mt-1">/ {10}일</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-xs text-green-600 mb-1 font-medium">총 공부 시간</p>
            <p className="text-2xl font-bold text-green-700">{10}시간</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-xs text-purple-600 mb-1 font-medium">출석률</p>
            <p className="text-2xl font-bold text-purple-700">{100}%</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center gap-2 mb-4">
          {/* <Calendar className="w-5 h-5 text-gray-700" /> */}
          <h3 className="text-lg font-bold text-gray-900">출석 상세 기록</h3>
        </div>
      </div>
    </div>
  );
}

export default SideView;
