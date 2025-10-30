import { useState, useEffect, use } from 'react';

function QRCheckinView() {
  const [qrValue, setQrValue] = useState('');
  const [state, setState] = useState('waiting');

  const startScan = () => {
    window.serialAPI.scan(); // preload에서 노출한 함수
  };

  useEffect(() => {
    if (state === 'waiting') {
      startScan();
    }
  }, [state]);

  useEffect(() => {
    const stopListening = window.serialAPI.onData((data) => {
      setQrValue(data); // 상태 업데이트
      if (data == '404') {
        setState('timeout');
      } else {
        setState('success');
      }
    });

    return () => stopListening(); // 정리
  }, []);

  return (
    <>
      {state === 'waiting' && <h1>QR을 스캐너에 가까이 대주세요.</h1>}
      {state === 'scaning' && <h1>인증중...</h1>}
      {state === 'success' && <h1>코드:{qrValue}</h1>}
      {state === 'timeout' && (
        <>
          <h1>시간이 초과 되었습니다, 다시 시도해주세요.</h1>
          <button
            className="border border-slate-200 rounded-2xl p-4"
            onClick={() => setState('waiting')}
          >
            재시도 하기
          </button>
        </>
      )}
      {state === 'fail' && (
        <>
          <h1>유효하지 않은 코드입니다, 다시 시도해주세요</h1>
          <button
            className="border border-slate-200 rounded-2xl p-4"
            onClick={() => setState('waiting')}
          >
            재시도 하기
          </button>
        </>
      )}
    </>
  );
}

export default QRCheckinView;
