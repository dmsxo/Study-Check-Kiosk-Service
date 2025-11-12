function AcademicCalendar() {
  return (
    <>
      <h1 className="font-semibold text-3xl text-gray-900 mb-5">학사 일정 관리</h1>

      {/* 옵션 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">
        <h2 className="font-semibold mb-2">옵션</h2>
        <div className="flex flex-wrap gap-6">
          <div className="grow">
            <label className="text-sm font-semibold">학년</label>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 border border-slate-200 rounded-2xl p-2 min-w-fit">
                1학년
              </button>
              <button className="flex-1 border border-slate-200 rounded-2xl p-2 min-w-fit">
                2학년
              </button>
              <button className="flex-1 border border-slate-200 rounded-2xl p-2 min-w-fit">
                3학년
              </button>
            </div>
          </div>
          <div className="grow">
            <label className="text-sm font-semibold">자율 학습 유형</label>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 border border-slate-200 rounded-2xl p-2 min-w-fit">
                아침 독서
              </button>
              <button className="flex-1 border border-slate-200 rounded-2xl p-2 min-w-fit">
                야간 자율
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 캘린더 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        
      </div>
    </>
  );
}

export default AcademicCalendar;
