import { Flame, Calendar, AlarmClock, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "../../../components/StatViewComponents";
import { LayoutContainer, ScreenFrame } from "../../../components/UIComponents";
import { getStatus } from "../../../api/AttendanceAPI";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAttendance } from "../../../hooks/useAttendance";

function getWeekTotalDay(data) {
  return data.filter((item) => item.studytime > 0).length + 1;
}

function getWeekTotaTime(data, time) {
  const pre = dayjs.duration(
    data.reduce((sum, item) => sum + item.studytime, 0),
    "second"
  );
  const total = pre.add(time);

  return total;
}

function getWeekAverage(data, time) {
  const today = dayjs();

  const validData = data.filter((item) =>
    dayjs(item.date).isSameOrBefore(today, "day")
  );

  if (validData.length === 0) return 0; // 데이터 없으면 0 반환

  const totalStudyTime = getWeekTotaTime(data, time);

  const averageSeconds = totalStudyTime.asSeconds() / validData.length;

  return dayjs.duration(averageSeconds, "seconds"); // 다시 duration으로
}

function formatDuration(total) {
  let messege = `${total.hours()}시간 ${total.minutes()}분`;
  if (total.hours() === 0) {
    messege = `${total.minutes()}분`;
    if (total.minutes() === 0) messege = "기록 없음";
  }
  return messege;
}

function StudyView() {
  const checkInTime = useRef(null); // 오늘 기준 초
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data, isPending } = useAttendance();
  const [isAutoCheckout, setIsAutoCheckout] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckinTime = async () => {
      try {
        const status = await getStatus();
        const timeStr = status.start_time; // "HH:MM:SS"
        console.log(status);
        setIsAutoCheckout(status.isAutoCheckOut);
        setEndTime(dayjs.tz(status.end_time, "HH:mm:ss", "Asia/Seoul"));
        if (timeStr) {
          checkInTime.current = dayjs.tz(timeStr, "HH:mm:ss", "Asia/Seoul");
          const now = dayjs().tz("Asia/Seoul");
          setTime(dayjs.duration(now.diff(checkInTime.current)), "second");
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
      const now = dayjs().tz("Asia/Seoul");
      if (endTime.isAfter(dayjs().tz("Asia/Seoul"))) {
        setTime(dayjs.duration(now.diff(checkInTime.current)));
      } else {
        clearInterval(interval);
        return;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [checkInTime.current]);

  if (isPending) return <></>;
  const statData = data.attendances_night;
  const weekData = statData.getThisWeekData();

  if (loading) return <></>;
  else
    return (
      <ScreenFrame>
        <LayoutContainer>
          <div className="flex gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <div className="text-xs text-gray-600 font-medium">
              오늘의 순공 시간
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h2 className="font-bold text-2xl mb-2">
              {time.hours() != 0 && `${time.hours()}시간`} {time.minutes()}분{" "}
              {time.seconds()}초
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm">공부중</p>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
        </LayoutContainer>
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            title={"연속 출석일"}
            Icon={Flame}
            color={"text-orange-500"}
            value={statData.streak + 1}
            bgColor={"bg-white"}
          />
          <StatCard
            title={"이번주 총 출석일"}
            Icon={Calendar}
            color={"text-emerald-500"}
            value={getWeekTotalDay(weekData)}
            bgColor={"bg-white"}
          />
          <StatCard
            title={"이번주 순공시간"}
            Icon={AlarmClock}
            color={"text-purple-500"}
            value={formatDuration(getWeekTotaTime(weekData, time))}
            bgColor={"bg-white"}
          />
          <StatCard
            title={"일 평균"}
            Icon={TrendingUp}
            color={"text-blue-500"}
            value={formatDuration(getWeekAverage(weekData, time))}
            bgColor={"bg-white"}
          />
        </div>

        {isAutoCheckout ? (
          <>시간이 지나면 자동으로 체크아웃 됩니다.</>
        ) : (
          <LayoutContainer className="text-center">
            <button
              onClick={() => {
                navigate("/checkout");
              }}
            >
              체크아웃 하기
            </button>
          </LayoutContainer>
        )}
      </ScreenFrame>
    );
}

export default StudyView;
