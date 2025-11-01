import { useState, useRef, useEffect } from 'react';

export default function VerificationCodeInput() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const allFilled = code.every((digit) => digit !== '');
    if (allFilled && !isComplete) {
      setIsComplete(true);
    }
  }, [code, isComplete]);

  const handleChange = (index, value) => {
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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
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
              className="w-12 h-16 text-center text-3xl font-medium text-blue-600 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
