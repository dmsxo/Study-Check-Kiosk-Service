import { useState, useEffect } from 'react';
import { QrCode, LoaderCircle } from 'lucide-react';
import { check_in, verifyCode, getUser } from '../../api/AttendanceAPI';
import CheckinComplete from '../components/ResultsScreens/CheckInComplete';
import TimeOut from '../components/ResultsScreens/TimeOut';
import VerificationFailed from '../components/ResultsScreens/VerificationFailed';
import HomeButton from '../components/UI/HomeButton';

function QRCheckinView() {
  const [qrValue, setQrValue] = useState('');
  const [state, setState] = useState('waiting');
  const [issuer, setIssuer] = useState('');

  const startScan = () => {
    if (window.serialAPI) {
      window.serialAPI.scan();
    }
  };

  useEffect(() => {
    if (window.serialAPI) {
      const stopListening = window.serialAPI.onData((data) => {
        setQrValue(data);
        console.log(data);
        if (data === '404') {
          setState('timeout');
        } else {
          setState('scanning');
        }
      });
      return () => stopListening();
    }
  }, []);

  useEffect(() => {
    if (state === 'waiting') {
      startScan();
    } else if (state === 'scanning') {
      const verify = async () => {
        try {
          const res = await verifyCode(qrValue);
          const [issuerType, detail] = res.split(':');
          if (issuerType === 'student') {
            const user = await getUser(detail);
            console.log(user);
            setIssuer(user.name);
            await check_in(user.student_id, 'night');
            setState('success');
          }
        } catch (err) {
          console.error(err);
          setState('fail');
        }
      };
      verify();
    }
  }, [state]); // qr vlaue 필요한가? 나중에 테스트 ㄱ

  const renderContent = () => {
    switch (state) {
      case 'waiting':
        return (
          <div className="flex flex-col items-center gap-16">
            <QrCode size={140} className="text-gray-900" strokeWidth={1.5} />
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-gray-900">QR 코드를</h1>
              <h1 className="text-5xl font-bold text-gray-900">스캔해주세요</h1>
            </div>
            <div className="flex gap-3">
              <div className="w-4 h-4 bg-gray-900 rounded-full animate-bounce"></div>
              <div
                className="w-4 h-4 bg-gray-900 rounded-full animate-bounce"
                style={{ animationDelay: '0.15s' }}
              ></div>
              <div
                className="w-4 h-4 bg-gray-900 rounded-full animate-bounce"
                style={{ animationDelay: '0.3s' }}
              ></div>
            </div>
          </div>
        );
      case 'scanning':
        return (
          <div className="flex flex-col items-center gap-16">
            <LoaderCircle
              size={140}
              className="text-gray-900 animate-spin"
              strokeWidth={1.5}
              style={{ animationDuration: '2s' }}
            />
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-gray-900">인증 중</h1>
            </div>
          </div>
        );
      case 'success':
        return <CheckinComplete issuer={issuer} />;
      case 'timeout':
        return <TimeOut onClick={() => setState('waiting')} />;
      case 'fail':
        return <VerificationFailed onClick={() => setState('waiting')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-white p-8">
      <div className="flex-1 flex items-center justify-center w-full">{renderContent()}</div>

      <HomeButton />
    </div>
  );
}

export default QRCheckinView;
