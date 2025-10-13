import dummy from "../test/attendance_dummy";
import { getTimeDiff } from "../utils/date.utils";

function mappingRaw(raw){
  return raw.map(data =>({
    type: data.type,
    date: data.date,
    check_in: data.check_in_time,
    check_out: data.check_out_time,
    description: data.description
  }))
}

export function getGroupData(raw = dummy){
  const data = mappingRaw(raw);
  const {morning, night} = data.reduce((acc, cur) =>{
    acc[cur.type].push(cur);
    return acc;
  }, {morning: [], night: []});
  return {morning, night};
}

// 총 출석일
// 주별, 달별, 총 출석률 (총 날자는 개학날부터 현재 날짜 까지 ....실제로 할때는 주말과 공휴일을 전부 제외한 날의 수)
// 현재 출석률은 출석만 하면 1시간을 공부하라도 그날은 공부 한거로 처리
// 연속 출석일
// 최장 연속 출석일
// 출석을 한 날에 공부한 시간 (분)

function getStreakData(data){
  let streak = 0, longestStreak = 0;

  return {streak, longestStreak}
}

export function getRecords(data){
  const total = data.length;

  const studyTimes = data.map(day => getTimeDiff(day.check_in, day.check_out));

  const { streak, longestStreak } = getStreakData(data.map(day => day.date));

  return {total, streak, longestStreak, studyTimes};
}