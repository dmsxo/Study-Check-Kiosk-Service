import { Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';

function HomeView() {
  return (
    <div className="h-screen flex flex-col gap-4 p-4">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Carousel />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => (window.location.href = '#/qr')}
          className="flex border border-slate-200 rounded-2xl h-20 p-4 items-center justify-center"
        >
          <p className="font-semibold">QR로 체크인</p>
        </button>
        <button
          onClick={() => (window.location.href = '#/key')}
          className="flex border border-slate-200 rounded-2xl h-20 p-4 items-center justify-center"
        >
          <p className="font-semibold">발급 키로 체크인</p>
        </button>
      </div>

      <button
        onClick={() => (window.location.href = '#/guide')}
        className="flex items-center justify-center"
      >
        <span className="flex items-center align-middle gap-2">
          <p className="text-blue-500">출석체크 시스템 사용이 처음이신가요? </p>
          <Info size={20} className="inline-block text-blue-500" />
          <p className="text-blue-500">이용 안내</p>
        </span>
      </button>
    </div>
  );
}

export default HomeView;
