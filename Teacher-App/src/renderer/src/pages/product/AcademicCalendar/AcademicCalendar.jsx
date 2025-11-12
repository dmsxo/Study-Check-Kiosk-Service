import { useState } from 'react';
import CalendarUI from '../../../components/Calendar';
import ToggleGroup from '../../../components/AcademicCalendar/Toggles';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import PeriodManagement from './PeriodManagement';

function AcademicCalendar() {
  return (
    <>
      <h1 className="font-semibold text-3xl text-gray-900 mb-5">학사 일정 관리</h1>

      <PeriodManagement />
    </>
  );
}

export default AcademicCalendar;
