import ScreenFrame from './../../components/UIComponents/ScreenFrame';
import LayoutContainer from './../../components/UIComponents/LayoutContainer';
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { transformPeriods } from '../../helpers/application.helper';
import PeriodCard from '../../components/ApplicationComponents/PeriodCard';

// 인원 현황 슬라이더 컴포넌트
const CapacitySlider = ({ enrolled, capacity }) => {
  const percentage = (enrolled / capacity) * 100;
  const isFull = enrolled >= capacity;
  const isAlmostFull = percentage >= 90;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">신청 인원</span>
        <span
          className={`font-semibold ${
            isFull
              ? 'text-red-600'
              : isAlmostFull
              ? 'text-orange-600'
              : 'text-gray-900'
          }`}
        >
          {enrolled} / {capacity}명
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFull
              ? 'bg-red-500'
              : isAlmostFull
              ? 'bg-orange-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {isFull && (
        <p className="text-xs text-red-600 font-medium">
          정원이 마감되었습니다
        </p>
      )}
      {isAlmostFull && !isFull && (
        <p className="text-xs text-orange-600 font-medium">마감 임박</p>
      )}
    </div>
  );
};

function ApplicationView() {
  const [studyPrograms, setStudyPrograms] = useState([]);

  useEffect(() => {
    async function loadPeriods() {
      const res = await transformPeriods();
      console.log(res);
      setStudyPrograms(res);
    }
    loadPeriods();
  }, []);

  console.log('studyPrograms:', studyPrograms);

  return (
    <ScreenFrame>
      <h1 className="font-semibold text-gray-900 text-xl mb-4">나의 신청</h1>
      <LayoutContainer>
        <h3 className="font-semibold text-gray-900 mb-2">프로그램 리스트</h3>
        {studyPrograms.length > 0 &&
          studyPrograms?.map((program) => {
            console.log('배열 안', program);
            return <PeriodCard period={program} key={program.id} />;
          })}
      </LayoutContainer>
    </ScreenFrame>
  );
}

export default ApplicationView;
