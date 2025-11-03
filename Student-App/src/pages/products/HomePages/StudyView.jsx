import { Flame, Calendar, AlarmClock, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "../../../components/StatViewComponents";
import { LayoutContaner, ScreenFrame } from "../../../components/UIComponents";
import { Link } from "react-router-dom";
import { check_out } from "../../../api/checkin";

function StudyView({ setIsStudying, statData }) {
  // const [isStudying, setIsStuding] = useLocalStorage("isStudying", false);
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
          <h2 className="font-bold text-2xl mb-2">HH:MM:SS</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm">공부중</p>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </LayoutContaner>
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          title={"연속 출석일"}
          Icon={Flame}
          color={"text-orange-500"}
          value={10}
        />
        <StatCard
          title={"이번주 총 출석일"}
          Icon={Calendar}
          color={"text-emerald-500"}
          value={3}
        />
        <StatCard
          title={"이번주 순공시간"}
          Icon={AlarmClock}
          color={"text-purple-500"}
          value={3}
        />
        <StatCard
          title={"일 평균"}
          Icon={TrendingUp}
          color={"text-blue-500"}
          value={3}
        />
      </div>
      <button
        onClick={() => {
          setIsStudying(false);
          check_out("night");
        }}
      >
        <LayoutContaner className="text-center">체크아웃 하기</LayoutContaner>
      </button>
    </ScreenFrame>
  );
}

export default StudyView;
