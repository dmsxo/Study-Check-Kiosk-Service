import { useEffect, useState } from 'react';
import { getCode } from '../../api/checkin';
import { Clock } from 'lucide-react';

function KeyChekinView() {
  const [key, setKey] = useState('');
  const [state, setState] = useState('waiting');
  const [remain, setRemain] = useState(15);

  useEffect(() => {
    if (state === 'waiting') {
      //키 발급
      const run = async () => {
        const code = await getCode();
        setKey(code);
      };
      run();
      //타이머 시작
      const timer = setInterval(() => {
        setRemain((prev) => {
          if (prev === 0) {
            setState('timeout');
          } else return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state]);

  const RetryButton = () => (
    <button
      className="px-12 py-5 bg-black text-white text-xl font-bold rounded-3xl hover:bg-gray-800 transition-all duration-200 active:scale-95"
      onClick={() => {
        setState('waiting');
        setRemain(15);
      }}
    >
      다시 시도
    </button>
  );

  const renderContent = () => {
    switch (state) {
      case 'waiting':
        return (
          <div className="space-y-5 text-center">
            <h3 className="text-3xl font-bold">아래 키를 앱에 입력하세요</h3>
            <h1 className="text-6xl font-mono text-blue-600">{key}</h1>
            <h6 className="flex justify-center items-center gap-2">
              <p>키 만료까지 남은 시간</p>
              <Clock size={20} className="inline-block" />
              <p>{remain}s</p>
            </h6>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-16">
            {/* <CheckCircle size={160} className="text-gray-900" strokeWidth={1.5} />
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
            </div> */}
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-8">
      {renderContent()}

      {(!remain || remain <= 5) && (
        <button
          onClick={() => (window.location.href = '/')}
          className="absolute bottom-0 w-full max-w-md px-12 py-5 bg-gray-100 text-gray-900 text-xl font-bold rounded-3xl hover:bg-gray-200 transition-all duration-200 active:scale-95 mb-8"
        >
          홈으로
        </button>
      )}
    </div>
  );
}

export default KeyChekinView;
