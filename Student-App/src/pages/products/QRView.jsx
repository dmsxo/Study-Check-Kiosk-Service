import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef } from 'react';
import TicketCutLine from '../../components/QRViewComponents/TicketCutLine';
import { ScreenFrame } from '../../components/UIComponents';

function QRView({ code, getAuthCode }) {
  const [isStudy, setIsStudy] = useState(false);

  return (
    <ScreenFrame bgColor="bg-gradient-to-b from-gray-50 to-gray-200">
      <h1 className="font-black text-gray-900 text-xl mb-4">출석 체크</h1>

      <div className="bg-white rounded-2xl flex flex-col min-w-3xs max-w-3x mx-auto">
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
              <span className="text-gray-900 text-sm font-medium">5초</span>
            </div>
          </div>

          {/* 정보 그리드 */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">학번</p>
              <p className="text-gray-900 font-semibold">20129</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">이름</p>
              <p className="text-gray-900 font-semibold">황은태</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">현재 시각</p>
              <p className="text-gray-900 font-semibold">PM 10:27</p>
            </div>
          </div>
        </div>

        {/* 컷라인 */}
        <TicketCutLine bgColor="bg-gray-100" />

        {/* QR */}
        <div className="w-full aspect-square p-10 mb-8">
          <QRCodeSVG value={code} className="size-full" />
        </div>
      </div>
    </ScreenFrame>
  );
}

export default QRView;
