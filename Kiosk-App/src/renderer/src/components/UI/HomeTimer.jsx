import { useEffect, useState } from 'react';

export default function HomeTimer() {
  const [time, setTime] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((pre) => {
        if (pre >= 0) return pre - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (time <= 0) window.location.href = '/';
  }, [time]);

  return (
    <div className="text-center font-extralight text-sm text-gray-500">
      {time}초 후 홈 화면으로 돌아갑니다
    </div>
  );
}
