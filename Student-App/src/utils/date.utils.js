export function getTimeDiff(time1, time2){
  const [h1, m1, s1] = time1.split(':').map(Number);
  const [h2, m2, s2] = time2.split(':').map(Number);

  return (h2-h1)*60*60 + (m2-m1)*60 + (s2-s1);
}