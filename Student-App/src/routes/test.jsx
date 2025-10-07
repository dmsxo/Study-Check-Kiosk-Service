import React, { useState, useEffect } from 'react';
import { QrCode, User, BarChart3, Clock, Award, Target, CheckCircle, Bell, Settings, LogOut, Calendar } from 'lucide-react';

const StudentApp = () => {
  const [currentTab, setCurrentTab] = useState('qr');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(15);
  const [totalDays, setTotalDays] = useState(42);
  const [studyTime, setStudyTime] = useState(150);
  const [isTearing, setIsTearing] = useState(false);
  // 통계 탭 상태들을 최상위로 이동
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedSession, setSelectedSession] = useState('morning');

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  const QRTab = () => {
    const currentHour = currentTime.getHours();
    const isMorning = currentHour >= 7 && currentHour < 12;
    const isEvening = currentHour >= 18 && currentHour < 22;
    
    const getSessionType = () => {
      if (isMorning) return '아침 독서';
      if (isEvening) return '야간 자율학습';
      return '자율학습';
    };

    const getSessionIcon = () => {
      if (isMorning) return '📚';
      if (isEvening) return '🌙';
      return '✏️';
    };

    const handleCheckIn = () => {
      setIsTearing(true);
      setTimeout(() => {
        setIsCheckedIn(true);
        setIsTearing(false);
      }, 1500);
    };

    const getGoodbyeMessage = () => {
      if (isMorning) return '저녁에 또 만나요!';
      return '내일 아침에 봐요!';
    };

    return (
      <div className="flex-1 flex flex-col bg-slate-100">
        <div className="p-6 bg-white backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {getSessionType()} 티켓
              </h2>
              <p className="text-sm text-slate-500">
                {currentTime.toLocaleDateString('ko-KR', { 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'short'
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-slate-900">
                {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {!isCheckedIn ? (
            <div className="w-full max-w-sm relative">
              <div className={`bg-white shadow-xl border border-slate-200 relative overflow-hidden transition-all duration-1500 ${
                isTearing ? 'animate-pulse' : ''
              }`} style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
              }}>
                <div className={`transition-all duration-1500 ${
                  isTearing ? '-translate-y-4 rotate-2' : ''
                }`}>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">학습 티켓</h3>
                        <p className="text-blue-100 text-sm">{getSessionType()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl mb-1">{getSessionIcon()}</div>
                        <div className="text-xs text-blue-100">TICKET</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-slate-900">김학생</h4>
                        <p className="text-slate-600 text-sm">2학년 3반 15번</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">좌석</div>
                        <div className="font-mono font-bold text-slate-900">A-15</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-slate-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">날짜</div>
                        <div className="font-semibold text-slate-900">
                          {currentTime.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">시간</div>
                        <div className="font-semibold text-slate-900">
                          {isMorning ? '07:30' : '19:00'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-8 bg-white">
                  <div className="absolute left-0 top-1/2 w-4 h-8 bg-slate-100 rounded-r-full transform -translate-y-1/2 -translate-x-2"></div>
                  <div className="absolute right-0 top-1/2 w-4 h-8 bg-slate-100 rounded-l-full transform -translate-y-1/2 translate-x-2"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full border-t-2 border-dashed border-slate-300 mx-6"></div>
                  </div>
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div className="flex space-x-3">
                      {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`px-6 py-6 text-center transition-all duration-1500 ${
                  isTearing ? 'translate-y-4 -rotate-1' : ''
                }`}>
                  <div className="w-32 h-32 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center mx-auto mb-4">
                    <QrCode size={80} className="text-slate-700" />
                  </div>
                  <p className="text-slate-600 font-medium text-sm">입장권</p>
                  <p className="text-slate-500 text-xs mt-1">QR코드를 스캔해주세요</p>
                </div>
              </div>

              {isTearing && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-400 transform -translate-y-1/2 animate-pulse"></div>
                </div>
              )}

              <button 
                onClick={handleCheckIn}
                disabled={isTearing}
                className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTearing ? '티켓을 찢는 중...' : '체크인하기'}
              </button>
            </div>
          ) : (
            <div className="w-full max-w-sm space-y-6">
              <div className="bg-white shadow-lg border border-slate-200 overflow-hidden" style={{
                borderRadius: '20px 20px 5px 5px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
              }}>
                <div className="h-2 bg-white relative overflow-hidden">
                  <div className="absolute bottom-0 w-full h-2" style={{
                    background: '#e2e8f0',
                    clipPath: 'polygon(0% 0%, 3% 100%, 6% 0%, 9% 100%, 12% 0%, 15% 100%, 18% 0%, 21% 100%, 24% 0%, 27% 100%, 30% 0%, 33% 100%, 36% 0%, 39% 100%, 42% 0%, 45% 100%, 48% 0%, 51% 100%, 54% 0%, 57% 100%, 60% 0%, 63% 100%, 66% 0%, 69% 100%, 72% 0%, 75% 100%, 78% 0%, 81% 100%, 84% 0%, 87% 100%, 90% 0%, 93% 100%, 96% 0%, 99% 100%, 100% 0%)'
                  }}></div>
                </div>

                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">김학생</h4>
                        <p className="text-slate-600 text-sm">체크인 완료</p>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg border border-slate-200 overflow-hidden" style={{
                borderRadius: '5px 5px 20px 20px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
              }}>
                <div className="h-2 bg-white relative overflow-hidden">
                  <div className="absolute top-0 w-full h-2" style={{
                    background: '#e2e8f0',
                    clipPath: 'polygon(0% 100%, 3% 0%, 6% 100%, 9% 0%, 12% 100%, 15% 0%, 18% 100%, 21% 0%, 24% 100%, 27% 0%, 30% 100%, 33% 0%, 36% 100%, 39% 0%, 42% 100%, 45% 0%, 48% 100%, 51% 0%, 54% 100%, 57% 0%, 60% 100%, 63% 0%, 66% 100%, 69% 0%, 72% 100%, 75% 0%, 78% 100%, 81% 0%, 84% 100%, 87% 0%, 90% 100%, 93% 0%, 96% 100%, 99% 0%, 100% 100%)'
                  }}></div>
                </div>

                <div className="px-6 py-6 text-center">
                  <div className="w-40 h-40 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center mx-auto mb-4">
                    <QrCode size={100} className="text-slate-700" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="text-center">
                      <div className="text-slate-500">학습 시간</div>
                      <div className="font-semibold text-slate-900">{formatTime(studyTime)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-500">연속 출석</div>
                      <div className="font-semibold text-slate-900">{consecutiveDays}일</div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={16} className="text-green-600" />
                      <span className="text-green-800 font-medium text-sm">학습 진행 중</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsCheckedIn(false)}
                className="w-full py-4 bg-slate-600 text-white rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:bg-slate-700"
              >
                체크아웃하기
              </button>
            </div>
          )}

          {!isCheckedIn && !isTearing && (
            <div className="mt-8 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 max-w-sm w-full">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={20} className="text-blue-600" />
                </div>
                <h4 className="font-medium text-slate-900 text-sm">수고하셨습니다!</h4>
                <p className="text-slate-600 text-xs">{getGoodbyeMessage()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const StatsTab = () => {
    // 상태를 props로 받아서 사용
    const stats = {
      currentStreak: consecutiveDays,
      longestStreak: 28,
      totalDays: totalDays,
      attendanceRate: 89,
      morning: {
        weeklyRate: [85, 92, 78, 95, 88],
        monthlyRate: [82, 87, 91, 89, 85, 93, 88, 90, 86, 94, 89, 87],
        grassData: Array.from({length: 365}, (_, i) => ({
          date: new Date(2025, 0, 1 + i),
          attended: Math.random() > 0.3,
          level: Math.random() > 0.3 ? 1 : 0
        }))
      },
      evening: {
        weeklyRate: [92, 88, 95, 82, 90],
        monthlyRate: [89, 92, 85, 94, 88, 91, 87, 93, 86, 89, 92, 90],
        grassData: Array.from({length: 365}, (_, i) => ({
          date: new Date(2025, 0, 1 + i),
          attended: Math.random() > 0.2,
          hours: Math.random() > 0.2 ? Math.floor(Math.random() * 4) + 1 : 0
        }))
      }
    };

    const getIntensityColor = (hours, isEvening = false) => {
      if (!hours || hours === 0) return 'bg-slate-100';
      if (isEvening) {
        if (hours === 1) return 'bg-purple-200';
        if (hours === 2) return 'bg-purple-400';
        if (hours === 3) return 'bg-purple-600';
        if (hours >= 4) return 'bg-purple-800';
      } else {
        return 'bg-green-400';
      }
      return 'bg-slate-100';
    };

    const generateGrassCalendar = () => {
      const currentData = selectedSession === 'morning' ? stats.morning.grassData : stats.evening.grassData;
      const weeks = [];
      
      // Get last 20 weeks for display
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 140);
      
      for (let weekIndex = 0; weekIndex < 20; weekIndex++) {
        const week = [];
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);
          
          const dataIndex = Math.floor((currentDate - new Date(2025, 0, 1)) / (1000 * 60 * 60 * 24));
          const dayData = currentData[dataIndex] || { attended: false, hours: 0, level: 0 };
          
          week.push({
            date: currentDate,
            ...dayData
          });
        }
        weeks.push(week);
      }
      return weeks;
    };

    const weeks = generateGrassCalendar();
    const currentRateData = selectedPeriod === 'week' 
      ? stats[selectedSession].weeklyRate 
      : stats[selectedSession].monthlyRate;

    const maxRate = Math.max(...currentRateData);
    const minRate = Math.min(...currentRateData);

    return (
      <div className="flex-1 bg-slate-100 overflow-y-auto">
        <div className="p-6 bg-white backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">학습 통계</h2>
          <p className="text-slate-600 text-sm">자율학습 참여 현황을 분석해보세요</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-900 mb-1">{stats.currentStreak}</div>
              <div className="text-xs text-slate-500 font-medium">연속 출석</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-center">
              <div className="text-lg font-bold text-amber-600 mb-1">{stats.longestStreak}</div>
              <div className="text-xs text-amber-600 font-medium">최장 연속</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-center">
              <div className="text-lg font-bold text-blue-600 mb-1">{stats.totalDays}</div>
              <div className="text-xs text-blue-600 font-medium">전체 출석</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 text-center">
              <div className="text-lg font-bold text-green-600 mb-1">{stats.attendanceRate}%</div>
              <div className="text-xs text-green-600 font-medium">출석률</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 mb-6">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedSession('morning')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  selectedSession === 'morning'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌅 아침 독서
              </button>
              <button
                onClick={() => setSelectedSession('evening')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  selectedSession === 'evening'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌙 야간 자율학습
              </button>
            </div>
          </div>

          {/* GitHub Style Grass Calendar */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900">
                {selectedSession === 'morning' ? '아침 독서' : '야간 자율학습'} 활동
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>적게</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-100 rounded-sm"></div>
                  <div className={`w-2 h-2 rounded-sm ${selectedSession === 'morning' ? 'bg-green-200' : 'bg-purple-200'}`}></div>
                  <div className={`w-2 h-2 rounded-sm ${selectedSession === 'morning' ? 'bg-green-400' : 'bg-purple-400'}`}></div>
                  <div className={`w-2 h-2 rounded-sm ${selectedSession === 'morning' ? 'bg-green-600' : 'bg-purple-600'}`}></div>
                  <div className={`w-2 h-2 rounded-sm ${selectedSession === 'morning' ? 'bg-green-800' : 'bg-purple-800'}`}></div>
                </div>
                <span>많이</span>
              </div>
            </div>
            
            {/* Grass Grid */}
            <div className="overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm transition-all hover:scale-110 cursor-pointer ${
                          selectedSession === 'morning'
                            ? (day.attended ? 'bg-green-400' : 'bg-slate-100')
                            : getIntensityColor(day.hours, true)
                        }`}
                        title={`${day.date.toLocaleDateString('ko-KR')} - ${
                          selectedSession === 'morning'
                            ? (day.attended ? '출석' : '미출석')
                            : day.hours > 0 ? `${day.hours}시간 학습` : '미참여'
                        }`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Month Labels */}
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>5개월 전</span>
              <span>3개월 전</span>
              <span>1개월 전</span>
              <span>현재</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900">출석률 추이</h3>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedPeriod('week')}
                  className={`py-1 px-3 rounded-md text-xs font-medium transition-all ${
                    selectedPeriod === 'week'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  주별
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`py-1 px-3 rounded-md text-xs font-medium transition-all ${
                    selectedPeriod === 'month'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  월별
                </button>
              </div>
            </div>

            <div className="relative h-32 bg-slate-50 rounded-lg p-4">
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              
              <div className="absolute left-8 top-0 right-0 h-full">
                {[0, 25, 50, 75, 100].map((value) => (
                  <div 
                    key={value}
                    className="absolute w-full border-t border-slate-200"
                    style={{ bottom: `${value}%` }}
                  ></div>
                ))}
              </div>

              <div className="absolute left-8 top-0 right-0 h-full">
                <svg width="100%" height="100%" className="overflow-visible">
                  {currentRateData.map((rate, index) => {
                    if (index === currentRateData.length - 1) return null;
                    const x1 = (index / (currentRateData.length - 1)) * 100;
                    const y1 = 100 - rate;
                    const x2 = ((index + 1) / (currentRateData.length - 1)) * 100;
                    const y2 = 100 - currentRateData[index + 1];
                    
                    return (
                      <line
                        key={`line-${index}`}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke={selectedSession === 'morning' ? '#10b981' : '#a855f7'}
                        strokeWidth="2"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                  
                  {currentRateData.map((rate, index) => {
                    const x = (index / (currentRateData.length - 1)) * 100;
                    const y = 100 - rate;
                    
                    return (
                      <g key={`point-${index}`}>
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="4"
                          fill={selectedSession === 'morning' ? '#10b981' : '#a855f7'}
                          className="hover:r-6 transition-all duration-200 cursor-pointer"
                        />
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="2"
                          fill="white"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-slate-500 -mb-6">
                {currentRateData.map((_, index) => (
                  <span key={index}>
                    {selectedPeriod === 'week' ? `${index + 1}주` : `${index + 1}월`}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  selectedSession === 'morning' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <span className="text-slate-600">평균: {Math.round(currentRateData.reduce((a, b) => a + b, 0) / currentRateData.length)}%</span>
              </div>
              <div className="text-slate-600">
                최고: {maxRate}% | 최저: {minRate}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Calendar size={18} className="text-slate-600" />
                이번 달 현황
              </h3>
              <span className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">9월 2025</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-3">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="text-center text-xs text-slate-500 py-2 font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({length: 30}, (_, i) => {
                const morningAttended = Math.random() > 0.3;
                const eveningHours = Math.floor(Math.random() * 4);
                const isToday = i === 22;
                
                return (
                  <div key={i} className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all hover:scale-105 cursor-pointer relative overflow-hidden border border-slate-200">
                    {/* Background based on selected session */}
                    <div className={`absolute inset-0 ${
                      isToday 
                        ? 'bg-blue-500' 
                        : selectedSession === 'morning'
                          ? (morningAttended ? 'bg-green-100' : 'bg-slate-50')
                          : getIntensityColor(eveningHours, true).replace('bg-', 'bg-').replace('slate-100', 'slate-50')
                    }`}></div>
                    
                    {/* Date number */}
                    <span className={`relative z-10 ${
                      isToday ? 'text-white font-bold' : 'text-slate-700'
                    }`}>
                      {i + 1}
                    </span>
                    
                    {/* Indicator dots */}
                    <div className="relative z-10 flex gap-0.5 mt-0.5">
                      {morningAttended && (
                        <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-green-500'}`}></div>
                      )}
                      {eveningHours > 0 && (
                        <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-purple-500'}`}></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>아침 독서</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>야간 자율학습</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfileTab = () => (
    <div className="flex-1 bg-slate-100 overflow-y-auto">
      <div className="p-6 bg-white backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
            <User size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">김학생</h2>
            <p className="text-slate-600 font-medium text-sm">2학년 3반 15번</p>
            <p className="text-slate-500 text-xs">student@school.edu</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6">
          <div className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Bell size={16} className="text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-slate-900 font-medium text-sm">알림 설정</div>
                <div className="text-slate-500 text-xs">푸시 알림 및 일정 관리</div>
              </div>
            </div>
            <div className="w-10 h-5 bg-blue-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Settings size={16} className="text-slate-600" />
              </div>
              <div className="text-left">
                <div className="text-slate-900 font-medium text-sm">앱 설정</div>
                <div className="text-slate-500 text-xs">테마, 언어 및 기본 설정</div>
              </div>
            </div>
            <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
              <span className="text-slate-400">›</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Target size={16} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="text-slate-900 font-medium text-sm">목표 설정</div>
                <div className="text-slate-500 text-xs">학습 목표 및 일정 계획</div>
              </div>
            </div>
            <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
              <span className="text-slate-400">›</span>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">앱 정보</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-sm">버전</span>
              <span className="text-slate-900 font-medium text-sm">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-sm">마지막 업데이트</span>
              <span className="text-slate-900 font-medium text-sm">2025.09.15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-sm">문의하기</span>
              <span className="text-blue-600 font-medium text-sm">dev@school.edu</span>
            </div>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 p-4 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors border border-slate-200 shadow-md">
          <LogOut size={18} />
          <span className="font-medium text-sm">로그아웃</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col shadow-lg border border-slate-300">
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentTab === 'qr' && <QRTab />}
        {currentTab === 'stats' && <StatsTab />}
        {currentTab === 'profile' && <ProfileTab />}
      </div>

      <div className="flex-shrink-0 bg-white border-t border-slate-200 shadow-md">
        <div className="flex">
          <button
            onClick={() => setCurrentTab('qr')}
            className={`flex-1 flex flex-col items-center py-3 transition-colors ${
              currentTab === 'qr' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <QrCode size={20} className="mb-1" />
            <span className="text-xs font-medium">체크인</span>
          </button>
          
          <button
            onClick={() => setCurrentTab('stats')}
            className={`flex-1 flex flex-col items-center py-3 transition-colors ${
              currentTab === 'stats' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BarChart3 size={20} className="mb-1" />
            <span className="text-xs font-medium">통계</span>
          </button>
          
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex-1 flex flex-col items-center py-3 transition-colors ${
              currentTab === 'profile' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={20} className="mb-1" />
            <span className="text-xs font-medium">프로필</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentApp;