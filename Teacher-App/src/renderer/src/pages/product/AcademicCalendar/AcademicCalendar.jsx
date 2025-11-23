import { useState } from 'react';
import CalendarUI from '../../../components/Calendar';
import ToggleGroup from '../../../components/AcademicCalendar/Toggles';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import PeriodManagement from './PeriodManagement';
import OverrideSchedule from './OverrideSchedule';
import DefaultSchedule from './DefaultSchedule';

function AcademicCalendar() {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      term_id: 1,
      type: 'night',
      grades: [
        { grade: 1, capacity: 30 },
        { grade: 2, capacity: 20 },
        { grade: 3, capacity: 20 }
      ],
      application: {
        start: '2025-03-01',
        end: '2025-03-07'
      },
      operation: {
        start: '2025-03-10',
        end: '2025-07-18'
      },
      dailyOperation: {
        start: '18:00:00',
        end: '21:00:00'
      },
      additionalApplications: []
    }
  ]);

  const [overrides, setOverrides] = useState([
    {
      id: 1,
      date: '2025-05-15',
      description: '중간고사',
      targets: {
        morning: { grade1: false, grade2: false, grade3: false },
        night: { grade1: false, grade2: false, grade3: false }
      }
    },
    {
      id: 2,
      date: '2025-11-13',
      description: '수능일',
      targets: {
        morning: { grade1: false, grade2: false, grade3: false },
        night: { grade1: false, grade2: false, grade3: false }
      }
    }
  ]);

  const [weeklySchedule, setWeeklySchedule] = useState({
    SUN: {
      morning: { grade1: true, grade2: true, grade3: false },
      night: { grade1: false, grade2: false, grade3: true }
    },
    MON: {
      morning: { grade1: true, grade2: false, grade3: true },
      night: { grade1: false, grade2: true, grade3: false }
    },
    TUES: {
      morning: { grade1: true, grade2: true, grade3: true },
      night: { grade1: false, grade2: false, grade3: false }
    },
    WED: {
      morning: { grade1: true, grade2: true, grade3: false },
      night: { grade1: true, grade2: false, grade3: true }
    },
    THUR: {
      morning: { grade1: false, grade2: true, grade3: true },
      night: { grade1: true, grade2: false, grade3: false }
    },
    FRI: {
      morning: { grade1: true, grade2: false, grade3: true },
      night: { grade1: false, grade2: true, grade3: true }
    },
    SAT: {
      morning: { grade1: false, grade2: true, grade3: false },
      night: { grade1: true, grade2: false, grade3: true }
    }
  });

  return (
    <>
      <h1 className="font-semibold text-3xl text-gray-900 mb-5">학사 일정 관리</h1>
      <div className="flex flex-wrap gap-5">
        <PeriodManagement schedules={schedules} setSchedules={setSchedules} />
        <DefaultSchedule weeklySchedule={weeklySchedule} setWeeklySchedule={setWeeklySchedule} />
      </div>
      <OverrideSchedule overrides={overrides} setOverrides={setOverrides} />
    </>
  );
}

export default AcademicCalendar;
