import { QRCodeSVG } from "qrcode.react";
import { useState, useRef, useEffect } from "react";
import TicketCutLine from "../../../components/QRViewComponents/TicketCutLine";
import { ScreenFrame } from "../../../components/UIComponents";
import { Link } from "react-router-dom";
import { getStatus } from "../../../api/AttendanceAPI";
import { useAuth } from "../../../contexts/AuthContext";
import dayjs from "dayjs";

function QRView({ code, getAuthCode, setIsStudying }) {
  const INTERVAL_SEC = 10; // 반복 주기 (초)
  const [remain, setRemain] = useState(INTERVAL_SEC);
  const [now, setNow] = useState(dayjs().tz("Asia/Seoul").startOf("minute"));
  const { user } = useAuth();

  useEffect(() => {
    const updateTime = () => setNow(dayjs().tz("Asia/Seoul").startOf("minute"));

    // 현재 분 끝까지 남은 시간 계산
    const delay = 60000 - (dayjs().second() * 1000 + dayjs().millisecond());
    const timeoutId = setTimeout(() => {
      updateTime();
      // 이후 1분 간격 interval 시작
      const intervalId = setInterval(updateTime, 60000);
      // cleanup
      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      return await getStatus("night");
    };

    const timer = setInterval(() => {
      setRemain((prev) => {
        if (prev <= 1) {
          getAuthCode();
          return INTERVAL_SEC; // 리셋
        }
        return prev - 1; // 1초씩 감소
      });
      fetchStatus()
        .then((status) => {
          if (!!status) setIsStudying(true);
        })
        .catch(console.error);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScreenFrame bgColor="bg-gradient-to-b from-gray-50 to-gray-200">
      <h1 className="font-black text-gray-900 text-xl mb-4">출석 체크</h1>

      <div className="bg-white rounded-2xl flex flex-col min-w-3xs mx-auto">
        {/* 상단 정보 */}
        <div className="px-6 py-4 mt-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">
                QR 코드 인증
              </h3>
              <p className="text-gray-500 text-sm">키오스크에 스캔해주세요</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-gray-900 text-sm font-medium">
                {remain}초
              </span>
            </div>
          </div>

          {/* 정보 그리드 */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">학번</p>
              <p className="text-gray-900 font-semibold">{user.studentId}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">이름</p>
              <p className="text-gray-900 font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">체크인 시간</p>
              <p className="text-gray-900 font-semibold">
                {now.format("A HH:mm")}
              </p>
            </div>
          </div>
        </div>

        {/* 컷라인 */}
        <TicketCutLine bgColor="bg-gray-100" />

        {/* QR */}
        <div className="w-full aspect-square p-10 mb-2">
          <QRCodeSVG value={code} className="size-full" />
        </div>
      </div>

      <Link to="/key">
        <div className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl p-4 text-lg">
          키오스크 발급 키로 출석하기
        </div>
      </Link>
    </ScreenFrame>
  );
}

export default QRView;
