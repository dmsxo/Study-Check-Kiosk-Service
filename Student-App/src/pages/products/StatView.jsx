import React from 'react';
import { useState } from 'react';
import { Calendar, Flame, TrendingUp, Percent } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import LayoutContaner from '../../components/UIComponents/LayoutContaner';
import ScreenFrame from '../../components/UIComponents/ScreenFrame';
import ToggleTabs from '../../components/UIComponents/ToggleTabs';
import StreakCalendar from '../../components/StatViewComponents/StreakCalendar';
import StatCard from '../../components/StatViewComponents/StatCard';
import { getFullStatData } from '../../helpers/stats.helper';
import { getColorClass } from '../../helpers/calendar.helper';

function StatView() {
  // 현재 보고 있는 카테고리
  const [studyType, setStudyType] = useState('night');
  const [graphView, setGraphView] = useState('byWeek');

  // 달력 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const { morning, night } = getFullStatData();

  const activityData = studyType === 'night' ? night : morning;

  const currentData = [
    { month: '1월', rate: 85, total: 240, present: 204 },
    { month: '2월', rate: 88, total: 216, present: 190 },
    { month: '3월', rate: 92, total: 248, present: 228 },
    { month: '4월', rate: 87, total: 240, present: 209 },
    { month: '5월', rate: 90, total: 248, present: 223 },
    { month: '6월', rate: 89, total: 240, present: 214 },
    { month: '7월', rate: 91, total: 248, present: 226 },
    { month: '8월', rate: 86, total: 248, present: 213 },
    { month: '9월', rate: 93, total: 240, present: 223 },
    { month: '10월', rate: 94, total: 248, present: 233 },
  ];

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
      <LayoutContaner className="p-4 bg-white rounded-xl border border-slate-200">
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
      </LayoutContaner>

      {/* 달력 보기 */}
      <LayoutContaner>
        <h3 className="font-semibold text-gray-900 mb-2">출석 달력</h3>
        <div className="flex justify-center">
          <div className="flex-1 max-w-md min-w-3xs">
            {/* 달력 헤더 */}
            <StreakCalendar
              attendanceCalendar={activityData.calendar}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
      </LayoutContaner>

      {selectedDate && (
        <LayoutContaner>
          <div className="text-xs font-medium text-gray-500 mb-1">
            {selectedDate.date}
          </div>
          <div className="flex items-center gap-2">
            {selectedDate.studytime > 0 ? (
              <>
                <span
                  className={`w-3 h-3 rounded border ${getColorClass(
                    selectedDate.studytime
                  )}`}
                ></span>
                <span className="text-sm text-gray-900 font-medium">
                  {Math.floor(selectedDate.studytime / 3600)}시간{' '}
                  {Math.floor((selectedDate.studytime % 3600) / 60)}분 공부함
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">자습 안함</span>
            )}
          </div>
        </LayoutContaner>
      )}

      {/* 출석률 그래프 */}
      <LayoutContaner addSytle="space-y-3">
        <h3 className="font-semibold text-gray-900 mb-3">출석률 추이</h3>
        <ResponsiveContainer width="95%" height={300} className="mr-auto">
          <LineChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={'month'}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="rate"
              name="출석률 (%)"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </LayoutContaner>
    </ScreenFrame>
  );
}

export default StatView;
