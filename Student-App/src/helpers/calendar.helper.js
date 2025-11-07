import dayjs from 'dayjs';

const KST = 'Asia/Seoul';

export function generateMonthCalendar(attendanceCalendar, current) {
  const year = current.year();
  const month = current.month(); // 0 ~ 11

  const firstDay = dayjs.tz(`${year}-${month + 1}-01`, KST);
  const lastDay = firstDay.add(1, 'month').subtract(1, 'day');

  const startDay = firstDay.day(); // 0 = Sunday
  const daysInMonth = lastDay.date();

  const calendar = [];

  for (let i = 0; i < startDay; i++) {
    calendar.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = firstDay.date(d);
    const dateStr = date.format('YYYY-MM-DD');

    calendar.push({
      date: dateStr,
      studytime: attendanceCalendar[dateStr]?.studytime || 0,
      description: attendanceCalendar[dateStr]?.description || '',
      isToday:
        dateStr === dayjs().tz(KST).format('YYYY-MM-DD'),
    });
  }

  return calendar;
}

export function getColorClass(studytime) {
  if (studytime === 0) return 'bg-gray-100 border-gray-200';
  if (studytime <= 3600) return 'bg-emerald-200 border-emerald-300';
  if (studytime <= 7200) return 'bg-emerald-400 border-emerald-500';
  if (studytime <= 10800) return 'bg-emerald-600 border-emerald-700';
  return 'bg-emerald-800 border-emerald-900';
}

export function getTextColor (studytime) {
  if (studytime >= 14400) return 'text-white';
  return 'text-gray-700';
}

export function prevYear(setCurrentDate) {
  setCurrentDate(cur => dayjs(cur).subtract(1, 'year').startOf('year'));
}

export function nextYear(setCurrentDate) {
  setCurrentDate(cur => dayjs(cur).add(1, 'year').startOf('year'));
}

export function prevMonth(setCurrentDate) {
  setCurrentDate(cur => dayjs(cur).subtract(1, 'month').startOf('month'));
}

export function nextMonth(setCurrentDate) {
  setCurrentDate(cur => dayjs(cur).add(1, 'month').startOf('month'));
}