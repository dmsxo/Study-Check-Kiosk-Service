import RetryButton from '../UI/RetryButton';
import HomeTimer from '../UI/HomeTimer';
import { Clock } from 'lucide-react';

export default function TimeOut({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-16">
      <Clock size={140} className="text-gray-900" strokeWidth={1.5} />
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">시간 초과</h1>
        <p className="text-2xl text-gray-600">다시 시도해주세요</p>
      </div>
      <div className="space-y-4">
        <RetryButton onClick={onClick} />
        <HomeTimer />
      </div>
    </div>
  );
}
