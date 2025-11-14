import { useState } from 'react';
import CalendarUI from '../../../components/Calendar';
import ToggleGroup from '../../../components/AcademicCalendar/Toggles';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import PeriodManagement from './PeriodManagement';
import OverrideSchedule from './OverrideSchedule';

function AcademicCalendar() {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      semester: '1학기',
      type: '야간 자율',
      grades: [1, 2, 3],
      applicationStart: '2025-03-01',
      applicationEnd: '2025-03-07',
      operationStart: '2025-03-10',
      operationEnd: '2025-07-18',
      additionalApplications: []
    }
  ]);

  const [overrides, setOverrides] = useState([
    {
      id: 1,
      date: '2025-05-15',
      reason: '중간고사',
      grades: [1, 2, 3],
      types: ['아침독서', '야간 자율']
    },
    {
      id: 2,
      date: '2025-11-13',
      reason: '수능일',
      grades: [1, 2],
      types: ['아침독서', '야간 자율']
    }
  ]);

  return (
    <>
      <h1 className="font-semibold text-3xl text-gray-900 mb-5">학사 일정 관리</h1>
      <PeriodManagement schedules={schedules} setSchedules={setSchedules} />
      <OverrideSchedule overrides={overrides} setOverrides={setOverrides} />
    </>
  );
}

export default AcademicCalendar;
