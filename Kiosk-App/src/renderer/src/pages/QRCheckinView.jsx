import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, XCircle, LoaderCircle, Home } from 'lucide-react';
import { verifyCode } from '../../api/checkin';
import axios from 'axios';

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
            const user = await axios.get(`http://localhost:3000/users/${detail}`);
            setIssuer(user.data.name);
            await axios.post(
              `http://localhost:3000/users/${detail}/attendances/check-in?type=night`
            );
            setState('success');
          }
        } catch (err) {
          console.error(err);
          setState('fail');
        }
      };
      verify();
    }
  }, [state, qrValue]);

  const RetryButton = () => (
    <button
      className="px-12 py-5 bg-black text-white text-xl font-bold rounded-3xl hover:bg-gray-800 transition-all duration-200 active:scale-95"
      onClick={() => setState('waiting')}
    >
      다시 시도
    </button>
  );

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
        return (
          <div className="flex flex-col items-center gap-16">
            <CheckCircle size={160} className="text-gray-900" strokeWidth={1.5} />
            <div className="text-center space-y-8">
              <h1 className="text-6xl font-bold text-gray-900">체크인 완료</h1>
              <div className="space-y-6 pt-8">
                <p className="text-4xl font-bold text-gray-900">{issuer}님</p>
                <div className="space-y-2">
                  <p className="text-2xl text-gray-600">
                    {new Date().toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-2xl text-gray-600">자율학습 체크인</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'timeout':
        return (
          <div className="flex flex-col items-center gap-16">
            <Clock size={140} className="text-gray-900" strokeWidth={1.5} />
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold text-gray-900">시간 초과</h1>
              <p className="text-2xl text-gray-600">다시 시도해주세요</p>
            </div>
            <RetryButton />
          </div>
        );
      case 'fail':
        return (
          <div className="flex flex-col items-center gap-16">
            <XCircle size={140} className="text-gray-900" strokeWidth={1.5} />
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold text-gray-900">인증 실패</h1>
              <p className="text-2xl text-gray-600">유효하지 않은 코드입니다</p>
            </div>
            <RetryButton />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-white p-8">
      <div className="flex-1 flex items-center justify-center w-full">{renderContent()}</div>

      <button
        onClick={() => (window.location.href = '/')}
        className="absolute bottom-0 w-full max-w-md px-12 py-5 bg-gray-100 text-gray-900 text-xl font-bold rounded-3xl hover:bg-gray-200 transition-all duration-200 active:scale-95 mb-8"
      >
        홈으로
      </button>
    </div>
  );
}

export default QRCheckinView;
