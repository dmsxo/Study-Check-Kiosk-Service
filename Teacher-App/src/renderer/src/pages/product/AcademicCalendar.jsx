import { useState } from 'react';
import CalendarUI from '../../components/Calendar';
import ToggleGroup from '../../components/AcademicCalendar/Toggles';
import LayoutContainer from '../../components/UI/LayoutContainer';

function AcademicCalendar() {
  const [selectedGrades, setSelectedGrades] = useState(['1학년', '2학년', '3학년']);
  const [selectedTypes, setSelectedTypes] = useState(['아침 독서']);

  const grades = ['1학년', '2학년', '3학년'];
  const types = ['아침 독서', '야간 자율'];

  return (
    <>
      <h1 className="font-semibold text-3xl text-gray-900 mb-5">학사 일정 관리</h1>

      {/* 옵션 */}
      <LayoutContainer className="mb-5">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">조회 조건</h2>
        <hr className="text-slate-200 my-3" />
        <div className="flex flex-wrap gap-6">
          <div className="grow">
            <label className="text-sm font-semibold text-gray-800">학년</label>
            <div className="flex gap-2 mt-2">
              <ToggleGroup
                contents={grades}
                sellectedContent={selectedGrades}
                setSellectedContent={setSelectedGrades}
              />
            </div>
          </div>
          <div className="grow">
            <label className="text-sm font-semibold text-gray-800">자율 학습 유형</label>
            <div className="flex gap-2 mt-2">
              <ToggleGroup
                contents={types}
                sellectedContent={selectedTypes}
                setSellectedContent={setSelectedTypes}
              />
            </div>
          </div>
        </div>
      </LayoutContainer>
      {/* 캘린더 */}
      <LayoutContainer>
        {/* <div className="flex gap-2">
          <h2 className="flex-1 bg-gray-50 p-3 rounded-2xl">운영일:20일</h2>
          <button className="bg-gray-900 text-white p-3 rounded-2xl">오늘로</button>
        </div> */}
        <CalendarUI />
      </LayoutContainer>
    </>
  );
}

export default AcademicCalendar;
