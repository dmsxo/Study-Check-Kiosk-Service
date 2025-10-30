import { useState, useEffect } from 'react';

function QRCheckinView() {
  const [qrValue, setQrValue] = useState('');

  const startScan = () => {
    window.serialAPI.scan(); // preload에서 노출한 함수
  };

  useEffect(() => {
    const stopListening = window.serialAPI.onData((data) => {
      setQrValue(data); // 상태 업데이트
    });

    return () => stopListening(); // 정리
  }, []);

  return <p>I'm QR</p>;
}

export default QRCheckinView;
