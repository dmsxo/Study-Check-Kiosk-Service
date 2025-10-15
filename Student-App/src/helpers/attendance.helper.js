import { attendances } from "../test/attendance_dummy";
import { schoolDays } from "../test/school_days_dummy";
import { getTimeDiff, compareDates } from "../utils/date.utils";

/*
출석 raw data --------┯--> 1년 출석 캘린더 (휴일 스트릭 유지 가능)
학교 캘린더 raw data---┛    ex) {date:"2025-10-14", studytime: n, studytime_max: m}

returns *
총 출석일 : 출석 raw data의 length
1년 출석 캘린더
연속 출석일, 최장 연속 출석일 : 1년치 출석 캘린더 순회로 처리
기간별 출석일 : 1년 출석 캘린더에서 특정기간 안에 있는 0이 아닌 날들을 기준으로 weighted 혹은 no weighted 출석률 구하기 가능
*/

/**
 * 출석 raw data를 받아서 아침자율학습과,야간 자율학습으로 그룹화후 반환
 * @param {*} raw 
 * @returns 
 */
function groupByStudyType(raw){
  const {morning, night} = raw.reduce((acc, cur) =>{
    acc[cur.type].push(cur);
    return acc;
  }, {morning: [], night: []});
  return {morning, night};
}

/**
 *  1년동안 등교 가능 날에 공부한 시간을 반환
 * @param {*} attendanceRaw 
 * @param {*} schoolDaysRaw 
 * @returns 
 */
function buildAttendanceCalendar(attendance, schoolDaysRaw){
  const calendar = {};

  schoolDaysRaw.forEach(e => {
    if(!e.grade2) return;
    calendar[e.date] = {
      date: e.date,
      studytime: 0,
      description: ""
    }
  });

  if(attendance){
    attendance.forEach(e => {
      if(calendar[e.date]){
        calendar[e.date].studytime = getTimeDiff(e.check_in_time, e.check_out_time);
        calendar[e.date].description = e.description;
      }
    });
  }

  return calendar;
}

/**
 * 1년 출석 캘린더 파라미터를 받아 1년동안 스트릭, 최장 스트릭을 반환
 * @param {*} calendar 
 * @returns 
 */
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

/**
 * 출석 데이터와, 학교 운영 날자 raw 데이터를 받아서 Stat창에 필요한 정보를 전부 처리, 반환
 * @param {*} attendance 
 * @param {*} schoolDaysRaw 
 * @returns 
 */
function getStats(attendance, schoolDaysRaw){
  const total = attendance.length; 
  const calendar = buildAttendanceCalendar(attendance, schoolDaysRaw);
  const {streak, longest_streak} = getStreakData(calendar);

  /**
   * 두 YYYY-MM-DD 형식 날짜 사이의 기간 출석률을 반환
   * @param {string} startDate 
   * @param {string} endDate
   * @returns 
   */
  function getAttendanceRate(startDate, endDate){
    const { days, count } = Object.values(calendar).reduce((acc, cur) => {
      if(compareDates(startDate, cur.date) && compareDates(cur.date, endDate)){
        acc.days++;
        if(cur.studytime > 0) acc.count++;
      }
      return acc;
    },
    { days:0, count:0 });

    console.log(count, days);
    if(days === 0) return 0;
    else return Math.round(count / days * 100) / 100;
  }

  return {
    total,
    calendar,
    streak,
    longest_streak,
    getAttendanceRate
  }
}

/**
 * 아침 독서와 야간 자율학습 전부의 Stat을 반환
 * @returns 
 */
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