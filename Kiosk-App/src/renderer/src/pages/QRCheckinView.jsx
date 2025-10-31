import { useState, useEffect, use } from 'react';
import { verifyCode } from '../../api/checkin';

function QRCheckinView() {
  const [qrValue, setQrValue] = useState('');
  const [state, setState] = useState('waiting');
  const [issuer, setIssuer] = useState('');

  const startScan = () => {
    window.serialAPI.scan(); // preload에서 노출한 함수
  };

  useEffect(() => {
    const run = async () => {
      if (state === 'waiting') {
        startScan();
      }

      if (state === 'scanning') {
        const req = await verifyCode(qrValue);
        const [issuer, detail] = req.split(':');
        if (issuer === 'NotFound' && detail === '404') setState('fail');
        if (issuer === 'student') {
          setState('success');
          setIssuer(detail);
        }
      }
    };

    run(); // async 함수 내부에서 호출
  }, [state]);

  useEffect(() => {
    const stopListening = window.serialAPI.onData((data) => {
      setQrValue(data); // 상태 업데이트
      if (data == '404') {
        setState('timeout');
      } else {
        setState('scanning');
      }
    });

    return () => stopListening(); // 정리
  }, []);

  return (
    <>
      {state === 'waiting' && <h1>QR을 스캐너에 가까이 대주세요.</h1>}
      {state === 'scanning' && <h1>인증중...</h1>}
      {state === 'success' && <h1>{issuer}님 반갑습니다.</h1>}
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
