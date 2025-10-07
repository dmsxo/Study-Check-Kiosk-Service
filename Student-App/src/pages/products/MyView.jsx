import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound, SquarePen, LogOut, SunMoon, Bell } from 'lucide-react';

function MyView() {
  return (
    <div className="h-full bg-gray-50 min-w-fit p-4 space-y-3">
      <h1 className="font-semibold text-gray-900 text-xl mb-4">나의 정보</h1>
      {/* 기본 프로필 정보 */}
      <div className="flex items-start min-w-fit p-4 bg-white rounded-xl border border-slate-200">
        <UserRound className="shrink-0 size-12 text-gray-500" />
        <div className="flex-1 ml-4 ">
          <h2 className="font-semibold text-gray-900 text-lg">황은태</h2>
          <h3 className="text-gray-500 text-sm"> 2학년 1 반 29번</h3>
          <h3 className="text-gray-500 text-sm mb-2"> hwangeuntea@gmail.com</h3>
          <em className="font-serif text-gray-900 bg-amber-50 rounded-lg">
            "시발"
          </em>
        </div>
        <button className="size-6 ml-auto">
          <SquarePen className="text-gray-500" />
        </button>
      </div>
      {/* 설정 요소 */}
      <div className="min-w-fit p-4 bg-white rounded-xl border border-slate-200">
        <h3 className="font-semibold text-gray-900 mb-2">설정</h3>
        <div className="space-y-2">
          <div className="flex items-center ml-2">
            <Bell size={20} className="text-gray-700" />
            <h4 className="ml-3 text-gray-700 flex-1">알림 설정</h4>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 rounded-full transition-colors peer-checked:bg-blue-500 peer-focus:outline-none" />
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5" />
            </label>
          </div>

          <div className="flex items-center ml-2">
            <SunMoon size={20} className="text-gray-700" />
            <h4 className="ml-3 text-gray-700 flex-1">다크 모드</h4>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 rounded-full transition-colors peer-checked:bg-blue-500 peer-focus:outline-none" />
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5" />
            </label>
          </div>
        </div>
      </div>
      {/* 앱정보 */}
      <div className="min-w-fit p-4 bg-white rounded-xl border border-slate-200">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">앱 정보</h3>
        <div className="space-y-2 ml-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm text-gray-600">버전</h4>
            <h4 className="text-sm text-gray-600">1.0.0</h4>
          </div>

          <div className="flex justify-between items-center">
            <h4 className="text-sm text-gray-600">마지막 업데이트</h4>
            <h4 className="text-sm text-gray-600">2025.06.02</h4>
          </div>

          <div className="flex justify-between items-center">
            <h4 className="text-sm text-gray-600">개발자</h4>
            <h4 className="text-sm text-gray-600">황은태 김동우 노우성</h4>
          </div>

          <div className="flex justify-between items-center">
            <h4 className="text-sm text-gray-600">문의하기</h4>
            <h4 className="text-sm text-gray-600">hwangeuntea@gmail.com</h4>
          </div>
        </div>
      </div>
      {/* 로그아웃 버튼 */}
      <Link
        to="/login"
        className="flex items-center justify-center bg-white min-w-fit gap-2 p-4 rounded-xl border border-slate-200 text-red-600"
      >
        <LogOut size={18} />
        <h3 className="text-sm align-middle">로그아웃</h3>
      </Link>
    </div>
  );
}

export default MyView;
