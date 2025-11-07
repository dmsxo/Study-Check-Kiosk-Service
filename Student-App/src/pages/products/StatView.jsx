import React, { act, useEffect } from 'react';
import { useState } from 'react';
import { Calendar, Flame, TrendingUp, Percent } from 'lucide-react';
import {
  LayoutContainer,
  ScreenFrame,
  ToggleTabs,
} from '../../components/UIComponents';
import {
  StatCard,
  StreakCalendar,
  RateChart,
} from '../../components/StatViewComponents';
import { getColorClass } from '../../helpers/calendar.helper';
import dayjs from 'dayjs';
import { useAttendance } from '../../hooks/useAttendance';

function StatView() {
  // 현재 보고 있는 카테고리
  const [studyType, setStudyType] = useState('night');

  // 달력 상태
  const [currentDate, setCurrentDate] = useState(dayjs().tz('Asia/Seoul'));
  const [selectedDate, setSelectedDate] = useState(null);

  // selectedDate 초기화
  useEffect(() => {
    setSelectedDate(null);
  }, [studyType]);

  // 출석률 그래프 상태
  const [viewMode, setViewMode] = useState('month');
  const [curruntView, setCurruntView] = useState(dayjs().tz('Asia/Seoul'));
  const { data, isPending } = useAttendance();

  if (isPending) return <></>;

  const activityData =
    studyType === 'night' ? data.attendances_night : data.attendances_morning;
  console.log('activityData:', data);

  return (
    <ScreenFrame>
      <h1 className="font-semibold text-gray-900 text-xl mb-4">출석 현황</h1>

      {/* 카테고리 선택 탭 */}
      <ToggleTabs
        categories={['morning', 'night']}
        buttonNames={['아침 독서', '야간 자율학습']}
        value={studyType}
        onChange={(cat) => setStudyType(cat)}
      />
      {/* 개요 */}
      <LayoutContainer className="p-4 bg-white rounded-xl border border-slate-200">
        <h3 className="font-semibold text-gray-900 mb-2">개요</h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <StatCard
            Icon={Flame}
            color={'text-orange-500'}
            title={'연속 출석일'}
            value={activityData.streak}
          />
          <StatCard
            Icon={TrendingUp}
            color={'text-purple-500'}
            title={'최장 연속 출석일'}
            value={activityData.longest_streak}
          />
          <StatCard
            Icon={Calendar}
            color={'text-emerald-500'}
            title={'총 출석일'}
            value={activityData.total}
          />
          <StatCard
            Icon={Percent}
            color={'text-blue-500'}
            title={'출석률'}
            value={`${activityData.getRate('2025-01-01', '2025-12-31')}%`}
          />
        </div>
      </LayoutContainer>

      {/* 달력 보기 */}
      <LayoutContainer>
        <h3 className="font-semibold text-gray-900 mb-2">출석 달력</h3>
        <div className="flex justify-center">
          <div className="flex-1 max-w-md min-w-3xs">
            {/* 달력 헤더 */}
            <StreakCalendar
              attendanceCalendar={activityData.calendar}
              current={currentDate}
              setCurrentDate={setCurrentDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
      </LayoutContainer>

      {selectedDate && (
        <LayoutContainer>
          <div className="text-xs font-medium text-gray-500 mb-1">
            {selectedDate.date}
          </div>
          <div className="flex flex-col justify-center gap-2">
            {selectedDate.studytime > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded border ${getColorClass(
                      selectedDate.studytime
                    )}`}
                  ></span>
                  <span className="text-sm text-gray-900 font-medium">
                    {Math.floor(selectedDate.studytime / 3600)}시간{' '}
                    {Math.round((selectedDate.studytime % 3600) / 60)}분 공부함
                  </span>
                </div>

                <span className="text-sm text-gray-600 font-medium">
                  {selectedDate.description}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">자습 안함</span>
            )}
          </div>
        </LayoutContainer>
      )}

      {/* 출석률 그래프 */}
      <LayoutContainer className="space-y-3">
        <h3 className="font-semibold text-gray-900 mb-3 bg-eme">출석률 추이</h3>
        <div className="flex justify-center">
          <div className="flex-1 max-w-md min-w-3xs aspect-square">
            <RateChart
              viewMode={viewMode}
              setViewMode={setViewMode}
              curruntView={curruntView}
              setCurruntView={setCurruntView}
              getRate={activityData.getRate}
            />
          </div>
        </div>
      </LayoutContainer>
    </ScreenFrame>
  );
}

export default StatView;
