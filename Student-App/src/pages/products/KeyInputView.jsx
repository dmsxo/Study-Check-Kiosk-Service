import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, X } from 'lucide-react';
import { check_in, pong, verifyCode } from '../../api/AttendanceAPI';
import { useAuth } from '../../contexts/AuthContext';

export default function KeyInput() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const allFilled = code.every((digit) => digit !== '');
    if (allFilled && !isComplete) {
      setIsComplete(true);
      const verify = async () => {
        try {
          const res = await verifyCode(code.join(''));
          const [issuerType, kioskId] = res.split(':');
          if (issuerType === 'kiosk') {
            await check_in();
            await pong(kioskId, user.studentId);
            navigate('/', { replace: true });
          }
        } catch (err) {
          console.error(err);
          setIsError(true);
          setCode(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
          setIsComplete(false);
        }
      };
      verify();
    }
  }, [code, isComplete]);

  useEffect(() => {
    // 첫 번째 입력칸에 자동 포커스
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // 에러 상태면 다시 입력 시작할 때 에러 해제
    if (isError) {
      setIsError(false);
    }

    const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (sanitized.length === 0) {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      return;
    }

    if (sanitized.length > 1) {
      const newCode = [...code];
      for (let i = 0; i < sanitized.length && index + i < 6; i++) {
        newCode[index + i] = sanitized[i];
      }
      setCode(newCode);

      const nextIndex = Math.min(index + sanitized.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = sanitized[0];
    setCode(newCode);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const newCode = [...code];

    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center overflow-hidden">
      <div className="text-center">
        <div className="mb-8">
          <KeyRound className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 text-lg">
            키오스크에서 발급한 키를 입력하세요
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-12 h-16 text-center text-3xl font-semibold bg-transparent border-b-2 focus:outline-none ${
                isError
                  ? 'text-red-600 border-red-500 focus:border-red-500'
                  : 'text-blue-600 border-gray-300 focus:border-blue-600'
              }`}
            />
          ))}
        </div>

        {isError && (
          <div className="text-red-600 text-lg font-medium flex items-center justify-center gap-2">
            <X className="w-5 h-5" />
            유효하지 않은 코드입니다
          </div>
        )}
      </div>
    </div>
  );
}
