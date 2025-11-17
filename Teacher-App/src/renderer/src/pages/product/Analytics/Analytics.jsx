import { useState, useEffect, useRef } from 'react';
import AnalyticsMainContents from './AnalyiticsMainContents';
import SideView from './SideView';

function Analytics() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [contentWidth, setContentWidth] = useState(50); // % 기준
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(50);
  const [isOverlayMode, setIsOverlayMode] = useState(false);

  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // 화면 크기 감지
  useEffect(() => {
    const checkOverlayMode = () => {
      if (containerRef.current) {
        const vw = window.innerWidth;
        const containerWidth = containerRef.current.offsetWidth;
        const percent = (containerWidth / vw) * 100;

        // 70% 미만이면 오버레이
        setIsOverlayMode(percent < 65);
      }
    };

    checkOverlayMode();
    window.addEventListener('resize', checkOverlayMode);

    return () => window.removeEventListener('resize', checkOverlayMode);
  }, [selectedStudent]);

  const handleMouseDown = (e) => {
    if (isOverlayMode) return; // 오버레이 모드에서는 드래그 비활성화

    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(contentWidth);
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isOverlayMode) return;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const MIN_WIDTH = 40;
    const MAX_WIDTH = 50;

    animationRef.current = requestAnimationFrame(() => {
      const containerWidth = containerRef.current.offsetWidth;
      const delta = ((e.clientX - startX) / containerWidth) * 100;
      const newWidth = startWidth + delta;
      const boundedWidth = Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH);
      setContentWidth(boundedWidth);
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    document.body.style.userSelect = '';
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isOverlayMode]);

  return (
    <div ref={containerRef} className="flex h-full relative">
      {/* Main Contents */}
      <div
        style={
          selectedStudent && !isOverlayMode
            ? { width: `${contentWidth}%`, minWidth: '200px' }
            : { flex: 1 }
        }
        className="flex flex-col overflow-auto scrollbar-hide"
      >
        <AnalyticsMainContents
          setSelectedStudent={setSelectedStudent}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>

      {/* Handle - 오버레이 모드에서는 숨김 */}
      {selectedStudent && !isOverlayMode && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors relative group shrink-0 ml-4"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-gray-300 group-hover:bg-blue-600 rounded-full"></div>
        </div>
      )}

      {/* SideView - 오버레이 모드일 때 absolute로 오른쪽에 고정 */}
      {selectedStudent && (
        <div
          className={`${
            isOverlayMode ? 'absolute right-0 top-0 h-full w-[600px] max-w-[90%] z-10' : ''
          }`}
          style={!isOverlayMode ? { width: `${100 - contentWidth}%`, minWidth: '300px' } : {}}
        >
          <SideView selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
        </div>
      )}
    </div>
  );
}

export default Analytics;
