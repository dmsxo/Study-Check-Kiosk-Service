import { Flame, Calendar, AlarmClock, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '../../../components/StatViewComponents';
import { LayoutContaner, ScreenFrame } from '../../../components/UIComponents';
import { check_out, getCheckinTime } from '../../../api/AttendanceAPI';
import { useEffect, useState, useRef } from 'react';

function StudyView({ setIsStudying, statData }) {
  const checkInTime = useRef(null); // 오늘 기준 초
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckinTime = async () => {
      try {
        const timeStr = await getCheckinTime('night'); // "HH:MM:SS"
        if (timeStr) {
          checkInTime.current = hhmmssToSeconds(timeStr);
          const now = new Date();
          const nowSeconds =
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
          setSeconds(nowSeconds - checkInTime.current);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckinTime();
  }, []);

  useEffect(() => {
    if (checkInTime.current === null) return;

    const interval = setInterval(() => {
      const now = new Date();
      const nowSeconds =
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      setSeconds(nowSeconds - checkInTime.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [checkInTime.current]);

  function hhmmssToSeconds(hhmmss) {
    const [h, m, s] = hhmmss.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <></>;
  else
    return (
      <ScreenFrame>
        <LayoutContaner>
          <div className="flex gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <div className="text-xs text-gray-600 font-medium">
              오늘의 순공 시간
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h2 className="font-bold text-2xl mb-2">{formatTime(seconds)}</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm">공부중</p>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
        </LayoutContaner>
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            title={'연속 출석일'}
            Icon={Flame}
            color={'text-orange-500'}
            value={10}
            bgColor={'bg-white'}
          />
          <StatCard
            title={'이번주 총 출석일'}
            Icon={Calendar}
            color={'text-emerald-500'}
            value={3}
            bgColor={'bg-white'}
          />
          <StatCard
            title={'이번주 순공시간'}
            Icon={AlarmClock}
            color={'text-purple-500'}
            value={3}
            bgColor={'bg-white'}
          />
          <StatCard
            title={'일 평균'}
            Icon={TrendingUp}
            color={'text-blue-500'}
            value={3}
            bgColor={'bg-white'}
          />
        </div>
        <LayoutContaner className="text-center">
          <button
            onClick={() => {
              setIsStudying(false);
              check_out('night');
            }}
          >
            체크아웃 하기
          </button>
        </LayoutContaner>
      </ScreenFrame>
    );
}

export default StudyView;
