import { ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function GuideView() {
  return (
    <>
      <button className="text-gray-800 p-4" onClick={() => (window.location.href = '#/')}>
        <ChevronLeft size={30} />
      </button>

      <div className="flex justify-center items-center">
        <QRCodeSVG size={100} value={'https://study-check-kiosk-service.vercel.app/'} />
        <p>위 QR을 찍어 앱 접속!</p>
      </div>
    </>
  );
}

export default GuideView;
