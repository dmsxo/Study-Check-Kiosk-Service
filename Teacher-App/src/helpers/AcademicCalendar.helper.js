import { GetDefaultSchedule, GetOverrideSchedules, GetPeriods } from "../api/AcademicCalendarAPI"

// period grouping
export async function getPeriodsByGroup(){
  const rawData = await GetPeriods();
  
  const grouped = {};

  rawData.data.forEach(item => {
    const key = `${item.termId}_${item.studyType}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const result = [];

  Object.values(grouped).forEach(items => {
    const first = items[0]; // 대표값

    const grades = items.map(g => ({
      grade: g.grade,
      capacity: g.capacity !== null ? g.capacity : -1 // null이면 0 처리
    }));

    result.push({
      id: result.length+1,
      termId: first.termId,
      studyType: first.studyType,
      grades: grades,
      registration: first.registration,
      operation: first.operation,
      dailyOperation: first.dailyOperation,
      additionalRegistration: first.additionalRegistration
    });
  });

  return result;
}

// Default Schedule grouping
export async function getTransformedDefaultSchedule() {
  const rawData = await GetDefaultSchedule();

  const weekdays = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];
  const studyTypes = ["morning", "night"];
  const grades = [1, 2, 3];

  // 초기 구조 만들기
  const result = {};
  weekdays.forEach(day => {
    result[day] = {};
    studyTypes.forEach(type => {
      result[day][type] = {};
      grades.forEach(g => {
        result[day][type][`grade${g}`] = false; // 기본값 false
      });
    });
  });

  // 배열을 돌면서 true로 바꾸기
  rawData.data.forEach(item => {
    const { weekday, studyType, grade, isOpen } = item;
    result[weekday][studyType][`grade${grade}`] = isOpen;
  });
  console.log(result);
  return result;
}

// Override Schedule grouping
export async function getOverrideSchedulesByGroup() {
  const rawData = await GetOverrideSchedules();
  
  const result = Object.values(rawData.data.reduce((acc, cur) => {
    if (!acc[cur.date]) {
      acc[cur.date] = {
        id: cur.id, // id는 가장 첫 번째 항목 id 사용
        date: cur.date,
        descriptions: cur.descriptions,
        targets: {
          morning: { grade1: false, grade2: false, grade3: false },
          night: { grade1: false, grade2: false, grade3: false }
        }
      };
    }
    
    // targets에 isOpen 상태 넣기
    const gradeKey = `grade${cur.grade}`;
    acc[cur.date].targets[cur.studyType][gradeKey] = cur.isOpen;
    
    return acc;
  }, {}));

  return result;
}