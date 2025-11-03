import RetryButton from '../UI/RetryButton';
import HomeTimer from '../UI/HomeTimer';
import { XCircle } from 'lucide-react';

export default function VerificationFailed({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-16">
      <XCircle size={140} className="text-gray-900" strokeWidth={1.5} />
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">인증 실패</h1>
        <p className="text-2xl text-gray-600">유효하지 않은 코드입니다</p>
      </div>
      <div className="space-y-4">
        <RetryButton onClick={onClick} />
        <HomeTimer />
      </div>
    </div>
  );
}
