import { AlertTriangle } from 'lucide-react';

export default function NonConnectionSerialPort() {
  return (
    <div className="w-screen flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <AlertTriangle size={96} strokeWidth={1.5} className="text-gray-900 mb-8" />

      <h1 className="text-3xl font-bold text-gray-900 mb-4">시리얼 포트를 찾을 수 없어요</h1>

      <p className="text-gray-700 mb-8 leading-relaxed">
        관리자에게 문의하여, 센서와의 연결을 체크해주세요
      </p>
    </div>
  );
}
