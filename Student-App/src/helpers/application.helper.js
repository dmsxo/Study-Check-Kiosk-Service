import { getMyRegistrations, getPrograms } from '../api/applicationAPI';
import dayjs from 'dayjs'
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween); // 플러그인 확장
export async function transformPeriods(){
  const registrations = await getMyRegistrations();
  console.log(registrations);
  const periods = await getPrograms();

  const finalPeriods = periods.map(period => {
    const isParticipating = registrations.some(my => my.period.id === period.id);
    return {
      ...period,
      isApplication: isParticipating,
    };
  });
  return finalPeriods;
}

export async function getCurrentPeriodId() {
  const registrations = await getMyRegistrations();
  console.log(registrations);
  const now = dayjs();

    for (const regi of registrations) {
      const study = regi.period;
        const operationStart = dayjs(study.operation.start, "YYYY-MM-DD");
        const operationEnd = dayjs(study.operation.end, "YYYY-MM-DD").endOf('day'); // 날짜 끝까지 포함

        // 운영 기간 체크
        if (!now.isBetween(operationStart, operationEnd, null, '[]')) continue;

        // 운영 시간 체크 (오늘 기준으로 dayjs 객체 생성)
        const [startHour, startMin, startSec] = study.dailyOperation.start.split(":").map(Number);
        const [endHour, endMin, endSec] = study.dailyOperation.end.split(":").map(Number);

        const dailyStart = now.hour(startHour).minute(startMin).second(startSec);
        const dailyEnd = now.hour(endHour).minute(endMin).second(endSec);

        if (!now.isBetween(dailyStart, dailyEnd, null, '[]')) continue;

        return study.id; // 조건 만족하면 id 반환
    }

    return null; // 없으면 null
}
/*
이름 (학기와 타입 합치기)
신청기간, 운영기간
*/