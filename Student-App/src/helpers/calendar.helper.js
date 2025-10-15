export function generateMonthCalendar(attendanceCalendar, currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendar = [];
  // 이전 달의 빈 칸
  for (let i = 0; i < startDay; i++) {
    calendar.push(null);
  }
  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = date.toISOString().split('T')[0];
    calendar.push({
      date: dateStr,
      studytime: attendanceCalendar[dateStr]?.studytime || null,
      description: attendanceCalendar[dateStr]?.description || null,
      isToday: dateStr === new Date().toISOString().split('T')[0],
    });
  }
  return calendar;
}

export function getColorClass(studytime) {
  if (studytime === null) return 'bg-gray-100 border-gray-200';
  if (studytime <= 3600) return 'bg-emerald-200 border-emerald-300';
  if (studytime <= 7200) return 'bg-emerald-400 border-emerald-500';
  if (studytime <= 10800) return 'bg-emerald-600 border-emerald-700';
  return 'bg-emerald-800 border-emerald-900';
}

export function getTextColor (studytime) {
  if (studytime >= 14400) return 'text-white';
  return 'text-gray-700';
}

export function prevMonth(currentDate, setCurrentDate) {
  setCurrentDate(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  );
};

export function nextMonth(currentDate, setCurrentDate) {
  setCurrentDate(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  );
};