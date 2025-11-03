import { getAttendances } from "../api/AttendanceAPI";
import { attendances } from "../test/attendance_dummy";
import { schoolDays } from "../test/school_days_dummy";
import { getTimeDiff, compareDates } from "../utils/date.utils";
import { dateToStr } from "../utils/date.utils";
import dayjs from 'dayjs';

/*
출석 raw data --------┯--> 1년 출석 캘린더 (휴일 스트릭 유지 가능)
학교 캘린더 raw data---┛    ex) {date:"2025-10-14", studytime: n, studytime_max: m}

returns *
총 출석일 : 출석 raw data의 length
1년 출석 캘린더
연속 출석일, 최장 연속 출석일 : 1년치 출석 캘린더 순회로 처리
기간별 출석일 : 1년 출석 캘린더에서 특정기간 안에 있는 0이 아닌 날들을 기준으로 weighted 혹은 no weighted 출석률 구하기 가능
*/

const KST = 'Asia/Seoul';

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
      if(calendar[e.date] && e.check_in_time && e.check_out_time){
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
  function getRate(startDate, endDate){
    // // 방어: calendar가 없거나 비어있으면 0 반환
    // if (!calendar || Object.keys(calendar).length === 0) return 0;

    const start = dayjs(startDate).tz(KST);
    const end = dayjs(endDate).tz(KST);

    const { days, count } = Object.values(calendar).reduce((acc, cur) => {
      // cur이 undefined일 가능성도 방어
      // if (!cur || !cur.date) return acc;

      const curDate = dayjs(cur.date);

      if (curDate.isSameOrAfter(start, 'day') && curDate.isSameOrBefore(end, 'day')) {
        acc.days++;
        if (cur.studytime > 0) acc.count++;
      }
      return acc;
    }, { days: 0, count: 0 });

    return days === 0 ? 0 : Math.round((count / days) * 10000) / 100;
  }

  function getThisWeekData() {
  const today = dayjs();
  const monday = today.startOf('week').add(1, 'day'); // 일요일 기준 startOf('week') + 1 = 월요일
  const sunday = monday.add(6, 'day');

  const result = Object.values(calendar).filter(item => {
    const itemDate = dayjs(item.date);
    return itemDate.isSameOrAfter(monday, 'day') && itemDate.isSameOrBefore(sunday, 'day');
  });

  return result;
}

  return {
    total,
    calendar,
    streak,
    longest_streak,
    getRate,
    getThisWeekData
  }
}
/**
 * 아침 독서와 야간 자율학습 전부의 Stat을 반환
 * @returns 
 */
export async function getFullStatData(){
  const rawAttendances = await getAttendances();
  const rawSchoolDays = schoolDays;

  const attendanceByType = groupByStudyType(rawAttendances);

  const morningStats = getStats(attendanceByType.morning, rawSchoolDays);
  const nightStats = getStats(attendanceByType.night, rawSchoolDays);

  return {
    morning: morningStats,
    night: nightStats
  };
}

/**
 * @param {*} attendanceCalendar 
 * @param {string} curruntDate 
 */
export function getRateByMonth(getRate, currentDate){
  let curruntRates = [];
  
  for(let i = 0; i < 12; i++){
    const startDate = dayjs(currentDate).month(i).date(1).format('YYYY-MM-DD');
    const endDate = dayjs(currentDate).month(i).endOf('month').format('YYYY-MM-DD');
    curruntRates.push({ label:`${i+1}월`, rate: getRate(startDate, endDate)});
  }
  return curruntRates;
}

/**
 * @param {*} attendanceCalendar 
 * @param {string} curruntDate 
 */
export function getRateByWeek(getRate, currentDate){
  const weekRates = [];
  
  const monthStart = currentDate.startOf('month');
  const monthEnd = currentDate.endOf('month');
  const lastDate = monthEnd.date();

  let weekCount = 1;
  let startDate = 1;
  let endDate = 7;

  while (startDate <= lastDate) {
    const start = monthStart.date(startDate).format('YYYY-MM-DD');
    const end = monthStart.date(Math.min(endDate, lastDate)).format('YYYY-MM-DD');

    weekRates.push({ label: `${weekCount}주차`, rate: getRate(start, end) });

    // 다음 주로 이동
    startDate += 7;
    endDate += 7;
    weekCount++;
  }

  return weekRates;
}