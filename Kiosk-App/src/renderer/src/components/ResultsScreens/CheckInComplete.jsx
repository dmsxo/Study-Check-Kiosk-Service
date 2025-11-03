import HomeTimer from '../UI/HomeTimer';
import { CheckCircle } from 'lucide-react';

export default function CheckinComplete({ issuer }) {
  return (
    <div className="flex flex-col items-center gap-16">
      <CheckCircle size={160} className="text-gray-900" strokeWidth={1.5} />
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
            <p className="text-2xl text-gray-600 mb-2">자율학습 체크인</p>
            <HomeTimer />
          </div>
        </div>
      </div>
    </div>
  );
}
