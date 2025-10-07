import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef } from 'react';
import { User, Settings, Bell, Mail } from 'lucide-react';

function QRView() {
  const [activeTab, setActiveTab] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const contentRef = useRef(null);

  const tabs = [
    { id: 'profile', label: '프로필', icon: User },
    { id: 'settings', label: '설정', icon: Settings },
    { id: 'notifications', label: '알림', icon: Bell },
    { id: 'messages', label: '메시지', icon: Mail },
  ];

  // 최소 스와이프 거리 (픽셀)
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
    if (isRightSwipe && activeTab > 0) {
      setActiveTab(activeTab - 1);
    }

    // 리셋
    setTouchStart(0);
    setTouchEnd(0);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">프로필 정보</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div>
                  <h3 className="text-xl font-semibold">홍길동</h3>
                  <p className="text-gray-600">hong@example.com</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">가입일: 2024년 1월 15일</p>
                <p className="text-sm text-gray-600 mt-1">
                  마지막 로그인: 2시간 전
                </p>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">설정</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                <span className="font-medium">이메일 알림</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                <span className="font-medium">푸시 알림</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                <span className="font-medium">다크 모드</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">알림</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded"
                >
                  <p className="font-medium text-gray-800">
                    새로운 메시지가 도착했습니다
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{i}시간 전</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">메시지</h2>
            <div className="space-y-3">
              {['김철수', '이영희', '박민수'].map((name, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{name}</p>
                        <p className="text-sm text-gray-600">안녕하세요!</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">방금 전</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === index
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 스와이프 가능한 탭 콘텐츠 */}
          <div
            ref={contentRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="p-6 sm:p-8 touch-pan-y select-none"
          >
            <div className="animate-fadeIn">{renderContent()}</div>

            {/* 스와이프 힌트 */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                {activeTab > 0 && <span>← 왼쪽으로 스와이프</span>}
                {activeTab > 0 && activeTab < tabs.length - 1 && <span>|</span>}
                {activeTab < tabs.length - 1 && (
                  <span>오른쪽으로 스와이프 →</span>
                )}
              </p>
            </div>
          </div>

          {/* 인디케이터 dots */}
          <div className="flex justify-center gap-2 pb-4">
            {tabs.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeTab === index
                    ? 'bg-blue-600 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`${index + 1}번 탭으로 이동`}
              />
            ))}
          </div>
        </div>

        {/* 설명 섹션 */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            📱 스와이프 기능 추가됨
          </h3>
          <ul className="space-y-2 text-sm sm:text-base text-gray-700">
            <li>
              <strong>onTouchStart</strong>: 터치 시작 위치 저장
            </li>
            <li>
              <strong>onTouchMove</strong>: 터치 이동 추적
            </li>
            <li>
              <strong>onTouchEnd</strong>: 스와이프 방향 계산 및 탭 전환
            </li>
            <li>
              <strong>최소 거리</strong>: 50px 이상 스와이프 시 전환
            </li>
            <li>
              <strong>인디케이터</strong>: 현재 탭 위치 표시
            </li>
          </ul>
          <p className="mt-4 text-sm text-blue-600 font-medium">
            💡 모바일에서 좌우로 스와이프해보세요!
          </p>
        </div>
      </div>
    </div>
  );
}

export default QRView;
