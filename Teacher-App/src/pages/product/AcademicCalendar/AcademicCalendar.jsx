import { useEffect, useState } from 'react';
import CalendarUI from '../../../components/Calendar';
import ToggleGroup from '../../../components/AcademicCalendar/Toggles';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import PeriodManagement from './PeriodManagement';
import OverrideSchedule from './OverrideSchedule';
import { usePeriod } from '../../../hooks/usePeriod';
import { useOverridesAll } from '../../../hooks/useOverride';
import dayjs from 'dayjs';

function AcademicCalendar() {
  const {
    periods,
    isLoading: isPeriodLoading,
    isError: isPeriodError,
  } = usePeriod();

  const { data: overrides = [], isLoading: isOverrideLoading } =
    useOverridesAll();

  if (isPeriodLoading || isOverrideLoading) {
    return <div>로딩 중…</div>;
  }

  if (isPeriodError) {
    return <div>기간 데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <>
      <h1 className="font-semibold text-3xl text-gray-900 mb-5">
        학사 일정 관리
      </h1>
      <PeriodManagement schedules={periods} />
      <OverrideSchedule overrides={overrides} periods={periods} />
    </>
  );
}

export default AcademicCalendar;
