import { useEffect, useState } from 'react';
import CalendarUI from '../../../components/Calendar';
import ToggleGroup from '../../../components/AcademicCalendar/Toggles';
import LayoutContainer from '../../../components/UI/LayoutContainer';
import PeriodManagement from './PeriodManagement';
import OverrideSchedule from './OverrideSchedule';
import DefaultSchedule from './DefaultSchedule';
import {
  getOverrideSchedulesByGroup,
  getPeriodsByGroup,
  getTransformedDefaultSchedule
} from '../../../helpers/AcademicCalendar.helper';

function AcademicCalendar() {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      termId: 1,
      studyType: 'night',
      grades: [
        { grade: 1, capacity: 30 },
        { grade: 2, capacity: 20 },
        { grade: 3, capacity: 20 }
      ],
      registration: {
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
      additionalRegistration: []
    }
  ]);

  const [overrides, setOverrides] = useState([
    {
      id: 1,
      date: '2025-05-15',
      descriptions: ['중간고사'],
      targets: {
        morning: { grade1: false, grade2: false, grade3: false },
        night: { grade1: false, grade2: false, grade3: false }
      }
    },
    {
      id: 2,
      date: '2025-11-13',
      descriptions: ['수능일'],
      targets: {
        morning: { grade1: false, grade2: false, grade3: false },
        night: { grade1: false, grade2: false, grade3: false }
      }
    }
  ]);

  const [weeklySchedule, setWeeklySchedule] = useState({
    SUN: {
      morning: { grade1: false, grade2: false, grade3: false },
      night: { grade1: false, grade2: false, grade3: false }
    },
    MON: {
      morning: { grade1: false, grade2: false, grade3: false },
      night: { grade1: false, grade2: false, grade3: false }
    },
    TUES: {
      morning: { grade1: false, grade2: false, grade3: false },
      night: { grade1: false, grade2: false, grade3: false }
    },
    WED: {
      morning: { grade1: false, grade2: false, grade3: false },
      night: { grade1: false, grade2: false, grade3: false }
    },
    THUR: {
      morning: { grade1: false, grade2: false, grade3: false },
      night: { grade1: false, grade2: false, grade3: false }
    },
    FRI: {
      morning: { grade1: false, grade2: false, grade3: false },
      night: { grade1: false, grade2: false, grade3: false }
    },
    SAT: {
      morning: { grade1: false, grade2: false, grade3: false },
      night: { grade1: false, grade2: false, grade3: false }
    }
  });
  getOverrideSchedulesByGroup();

  useEffect(() => {
    async function loadPeriods() {
      try {
        const data = await getPeriodsByGroup();
        setSchedules(data);
        console.log(schedules);
      } catch (error) {
        console.error('Failed to load periods:', error);
      }
    }

    async function loadDefaultSchedule(params) {
      try {
        const data = await getTransformedDefaultSchedule();
        setWeeklySchedule(data);
      } catch (error) {
        console.error('Failed to load default schedule:', error);
      }
    }

    async function loadOverrideSchedules() {
      try {
        const data = await getOverrideSchedulesByGroup();
        setOverrides(data);
      } catch (error) {
        console.error('Failed to load override schedule:', error);
      }
    }
    loadPeriods();
    loadDefaultSchedule();
    loadOverrideSchedules();
  }, []);

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
