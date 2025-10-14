import { attendances } from "../test/attendance_dummy";
import { schoolDays } from "../test/school_days_dummy";
import { getTimeDiff } from "../utils/date.utils";

/*
출석 raw data --------┯--> 1년 출석 캘린더 (휴일 스트릭 유지 가능)
학교 캘린더 raw data---┛    ex) {date:"2025-10-14", studytime: n, studytime_max: m}

returns *
총 출석일 : 출석 raw data의 length
1년 출석 캘린더
연속 출석일, 최장 연속 출석일 : 1년치 출석 캘린더 순회로 처리
기간별 출석일 : 1년 출석 캘린더에서 특정기간 안에 있는 0이 아닌 날들을 기준으로 weighted 혹은 no weighted 출석률 구하기 가능
*/

function groupByStudyType(raw){
  const {morning, night} = raw.reduce((acc, cur) =>{
    acc[cur.type].push(cur);
    return acc;
  }, {morning: [], night: []});
  return {morning, night};
}

function buildAttendanceCalendar(attendanceRaw, schoolDaysRaw){
  const calendar = {};

  schoolDaysRaw.forEach(e => {
    calendar[e.date] = {
      date: e.date,
      studytime: 0,
      description: ""
    }
  });

  if(attendanceRaw){
    attendanceRaw.forEach(e => {
      if(calendar[e.date]){
        calendar[e.date].studytime = getTimeDiff(e.check_in_time, e.check_out_time);
        calendar[e.date].description = e.description;
      }
    });
  }

  return calendar;
}

function getStreakData(calendar){
  let streak = 0, longest_streak = 0;
  Object.values(calendar).forEach(e=>{
    if(e.studytime > 0){
      streak++;
      longest_streak = Math.max(streak, longest_streak);
    } 
    else streak = 0;
  });

  return {streak, longest_streak};
}

function getStats(attendance, schoolDaysRaw){
  const total = attendance.length; 
  const calendar = buildAttendanceCalendar(attendance, schoolDaysRaw);
  const {streak, longest_streak} = getStreakData(calendar);
  return {
    total,
    calendar,
    streak,
    longest_streak
  }
}

export function getFullStatData(){
  // 추후 API 호출할 raw datas
  const rawAttendances = attendances;
  const rawSchoolDays = schoolDays;
  // 1년치 출석 캘린더 생성
  const attendanceByType = groupByStudyType(rawAttendances);

  const morningStats = getStats(attendanceByType.morning, rawSchoolDays);
  const nightStats = getStats(attendanceByType.night, rawSchoolDays);

  return {
    morning: morningStats,
    night: nightStats
  };
}