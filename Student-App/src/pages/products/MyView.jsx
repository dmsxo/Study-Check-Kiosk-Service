import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserRound, SquarePen, LogOut, SunMoon, Bell } from 'lucide-react';
import LayoutContaner from '../../components/UIComponents/LayoutContaner';
import ScreenFrame from '../../components/UIComponents/ScreenFrame';
import Toggle from '../../components/UIComponents/Toggle';

function MyView({ setIsLoggedIn }) {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [isDark, setIsDark] = useState(false);

  let navigate = useNavigate();

  function Logout() {
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <ScreenFrame>
      <h1 className="font-semibold text-gray-900 text-xl mb-4">나의 정보</h1>
      {/* 기본 프로필 정보 */}
      <LayoutContaner addSytle="flex items-start">
        <UserRound className="shrink-0 size-12 text-gray-500" />
        <div className="flex-1 ml-4">
          <h2 className="font-semibold text-gray-900 mb-1">황은태</h2>
          <h3 className="text-gray-500 text-sm"> 2학년 1 반 29번</h3>
          <h3 className="text-gray-500 text-sm mb-1"> hwangeuntea@gmail.com</h3>
          <em className="font-serif text-gray-900 bg-amber-50 rounded-lg">
            "시발"
          </em>
        </div>
        <button className="size-6 ml-auto">
          <SquarePen className="text-gray-500" />
        </button>
      </LayoutContaner>

      {/* 설정 요소 */}
      <LayoutContaner>
        <h3 className="font-semibold text-gray-900 mb-2">설정</h3>
        <div className="space-y-2">
          <div className="flex items-center ml-2">
            <Bell size={20} className="text-gray-700" />
            <h4 className="ml-3 text-gray-700 flex-1">알림 설정</h4>
            <Toggle
              checked={notificationsOn}
              onChange={() => setNotificationsOn(!notificationsOn)}
            />
          </div>

          <div className="flex items-center ml-2">
            <SunMoon size={20} className="text-gray-700" />
            <h4 className="ml-3 text-gray-700 flex-1">다크 모드</h4>
            <Toggle checked={isDark} onChange={() => setIsDark(!isDark)} />
          </div>
        </div>
      </LayoutContaner>

      {/* 앱정보 */}
      <LayoutContaner>
        <h3 className="font-semibold text-gray-900 mb-3">앱 정보</h3>
        <div className="space-y-2 ml-2">
          <div className="flex justify-between items-center">
            <h4 className="text-gray-600">버전</h4>
            <h4 className="text-gray-600">1.0.0</h4>
          </div>

          <div className="flex justify-between items-center">
            <h4 className="text-gray-600">마지막 업데이트</h4>
            <h4 className="text-gray-600">2025.06.02</h4>
          </div>

          <div className="flex justify-between items-center">
            <h4 className="text-gray-600">개발자</h4>
            <h4 className="text-gray-600">황은태 김동우 노우성</h4>
          </div>

          <div className="flex justify-between items-center">
            <h4 className="text-gray-600">문의하기</h4>
            <h4 className="text-gray-600">hwangeuntea@gmail.com</h4>
          </div>
        </div>
      </LayoutContaner>

      {/* 로그아웃 버튼 */}
      <LayoutContaner>
        <button
          onClick={Logout}
          className="w-full flex items-center justify-center gap-2 text-red-600"
        >
          <LogOut size={18} />
          <h3 className="text-sm align-middle">로그아웃</h3>
        </button>
      </LayoutContaner>
    </ScreenFrame>
  );
}

export default MyView;
