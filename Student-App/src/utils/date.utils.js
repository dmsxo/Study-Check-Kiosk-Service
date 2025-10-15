export function getTimeDiff(time1, time2){
  const [h1, m1, s1] = time1.split(':').map(Number);
  const [h2, m2, s2] = time2.split(':').map(Number);

  return (h2-h1)*60*60 + (m2-m1)*60 + (s2-s1);
}

/**
 * day 1이 day2보다 빠른지 느린지 반환
 * @param {string} day1 
 * @param {string} day2 
 */
export function compareDates(day1, day2){ 
  const [y1, m1, d1] = day1.split('-').map(Number);
  const [y2, m2, d2] = day2.split('-').map(Number);

  return (y1 < y2 ? true : (m1 < m2 ? true : d1 < d2));
}