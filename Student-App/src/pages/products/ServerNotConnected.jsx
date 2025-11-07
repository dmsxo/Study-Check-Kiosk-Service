import React, { useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/AttendanceAPI';

export default function ServerNotConnected() {
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      await api.get('/health');
      navigate(-1);
    } catch (error) {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">연결 끊김</h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          서버와의 연결이 끊어졌습니다.
          <br />
          네트워크 연결을 확인해주세요.
        </p>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`}
          />
          {isRetrying ? '재연결 중...' : '다시 시도'}
        </button>
      </div>
    </div>
  );
}
